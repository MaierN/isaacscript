import {
  Card,
  CoinSubType,
  CollectibleType,
  EffectVariant,
  EntityType,
  HeartSubType,
  ItemPoolType,
  PillColor,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import { game } from "../core/cachedClasses";
import { DISTANCE_OF_GRID_TILE } from "../core/constants";
import { RockAltType } from "../enums/RockAltType";
import { BACKDROP_TYPE_TO_ROCK_ALT_TYPE } from "../objects/backdropTypeToRockAltType";
import { spawnEffectWithSeed, spawnNPCWithSeed } from "./entitiesSpecific";
import { isCollectibleInItemPool } from "./itemPool";
import {
  spawnCardWithSeed,
  spawnCoinWithSeed,
  spawnHeartWithSeed,
  spawnPillWithSeed,
  spawnTrinketWithSeed,
} from "./pickupsSpecific";
import { fireProjectilesInCircle } from "./projectiles";
import { getRandom } from "./random";
import { getRandomSeed, isRNG, newRNG } from "./rng";
import { spawnCollectible } from "./spawnCollectible";
import { repeat } from "./utils";
import { getRandomVector } from "./vector";

const ROCK_ALT_CHANCES = {
  NOTHING: 0.68,
  BASIC_DROP: 0.0967,

  /** Also used for e.g. black hearts from skulls. */
  TRINKET: 0.025,

  COLLECTIBLE: 0.005,
} as const;

const COIN_VELOCITY_MULTIPLIER = 2;

/** Matches the vanilla value, according to Fly's decompilation. */
const FART_RADIUS = DISTANCE_OF_GRID_TILE * 3;

const POLYP_PROJECTILE_SPEED = 10;
const POLYP_NUM_PROJECTILES = 6;

/**
 * Helper function to get the alternate rock type (i.e. urn, mushroom, etc.) that the current room
 * will have.
 *
 * The rock type is based on the backdrop of the room.
 *
 * For example, if you change the backdrop of the starting room of the run to `BackdropType.CAVES`,
 * and then spawn `GridEntityType.ROCK_ALT`, it will be a mushroom instead of an urn. Additionally,
 * if it is destroyed, it will generate mushroom-appropriate rewards.
 *
 * On the other hand, if an urn is spawned first before the backdrop is changed to
 * `BackdropType.CAVES`, the graphic of the urn will not switch to a mushroom. However, when
 * destroyed, the urn will still generate mushroom-appropriate rewards.
 */
export function getRockAltType(): RockAltType {
  const room = game.GetRoom();
  const backdropType = room.GetBackdropType();

  return BACKDROP_TYPE_TO_ROCK_ALT_TYPE[backdropType];
}

/**
 * Helper function for emulating what happens when a vanilla `GridEntityType.ROCK_ALT` grid entity
 * breaks.
 *
 * Most of the time, this function will do nothing, similar to how most of the time, when an
 * individual urn is destroyed, nothing will spawn.
 *
 * Note that in vanilla, trinkets will not spawn if they have already been removed from the trinket
 * pool. This function cannot replicate that behavior because there is no way to check to see if a
 * trinket is still in the pool. Thus, it will always have a chance to spawn the respective trinket
 * (e.g. Swallowed Penny from urns).
 *
 * When filled buckets are destroyed, 6 projectiles will always spawn in a random pattern (in
 * addition to any other rewards that are spawned). This function does not account for this, so if
 * you want to specifically emulate destroying a filled bucket, you have to account for the
 * projectiles yourself.
 *
 * The logic in this function is based on the rewards listed on the wiki:
 * https://bindingofisaacrebirth.fandom.com/wiki/Rocks
 *
 * @param position The place to spawn the reward.
 * @param rockAltType The type of reward to spawn. For example, `RockAltType.URN` will have a chance
 *                    at spawning coins and spiders.
 * @param seedOrRNG Optional. The `Seed` or `RNG` object to use. If an `RNG` object is provided, the
 *                  `RNG.Next` method will be called. Default is `getRandomSeed()`. Normally, you
 *                  should pass the `InitSeed` of the grid entity that was broken.
 * @returns Whether or not this function spawned something.
 */
export function spawnRockAltReward(
  position: Vector,
  rockAltType: RockAltType,
  seedOrRNG: Seed | RNG = getRandomSeed(),
): boolean {
  const rng = isRNG(seedOrRNG) ? seedOrRNG : newRNG(seedOrRNG);

  switch (rockAltType) {
    case RockAltType.URN: {
      return spawnRockAltRewardUrn(position, rng);
    }

    case RockAltType.MUSHROOM: {
      return spawnRockAltRewardMushroom(position, rng);
    }

    case RockAltType.SKULL: {
      return spawnRockAltRewardSkull(position, rng);
    }

    case RockAltType.POLYP: {
      return spawnRockAltRewardPolyp(position, rng);
    }

    case RockAltType.BUCKET_DOWNPOUR: {
      return spawnRockAltRewardBucketDownpour(position, rng);
    }

    case RockAltType.BUCKET_DROSS: {
      return spawnRockAltRewardBucketDross(position, rng);
    }
  }
}

function spawnRockAltRewardUrn(position: Vector, rng: RNG): boolean {
  const chance = getRandom(rng);
  let totalChance = 0;

  totalChance += ROCK_ALT_CHANCES.NOTHING;
  if (chance < totalChance) {
    return false;
  }

  totalChance += ROCK_ALT_CHANCES.BASIC_DROP;
  if (chance < totalChance) {
    const numCoinsChance = getRandom(rng);
    const numCoins = numCoinsChance < 0.5 ? 1 : 2;
    repeat(numCoins, () => {
      const randomVector = getRandomVector(rng);
      const velocity = randomVector.mul(COIN_VELOCITY_MULTIPLIER);
      spawnCoinWithSeed(CoinSubType.NULL, position, rng, velocity);
    });
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.TRINKET;
  if (chance < totalChance) {
    spawnTrinketWithSeed(TrinketType.SWALLOWED_PENNY, position, rng);
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.COLLECTIBLE;
  if (chance < totalChance) {
    const stillInPools = isCollectibleInItemPool(
      CollectibleType.QUARTER,
      ItemPoolType.DEVIL,
    );
    if (stillInPools) {
      spawnCollectible(CollectibleType.QUARTER, position, rng);
      return true;
    }

    return false;
  }

  // Since the detrimental effect is the final option, we don't need to check the chance.
  const numEnemiesChance = getRandom(rng);
  const numEnemies = numEnemiesChance < 0.5 ? 1 : 2;
  const length = DISTANCE_OF_GRID_TILE * 3;
  repeat(numEnemies, () => {
    const randomVector = getRandomVector(rng);
    const offset = randomVector.mul(length);
    const targetPos = position.add(offset);
    EntityNPC.ThrowSpider(position, undefined, targetPos, false, 0);
  });
  return true;
}

function spawnRockAltRewardMushroom(position: Vector, rng: RNG): boolean {
  const room = game.GetRoom();
  const roomType = room.GetType();

  const chance = getRandom(rng);
  let totalChance = 0;

  totalChance += ROCK_ALT_CHANCES.NOTHING;
  if (chance < totalChance) {
    return false;
  }

  totalChance += ROCK_ALT_CHANCES.BASIC_DROP;
  if (chance < totalChance) {
    spawnPillWithSeed(PillColor.NULL, position, rng);
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.TRINKET;
  if (chance < totalChance) {
    spawnTrinketWithSeed(TrinketType.LIBERTY_CAP, position, rng);
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.COLLECTIBLE;
  if (chance < totalChance) {
    if (roomType === RoomType.SECRET) {
      const wavyCapChance = getRandom(rng);
      if (wavyCapChance < 0.0272) {
        const stillInPools = isCollectibleInItemPool(
          CollectibleType.WAVY_CAP,
          ItemPoolType.SECRET,
        );
        if (stillInPools) {
          spawnCollectible(CollectibleType.WAVY_CAP, position, rng);
          return true;
        }
      }
    }

    const magicMushroomStillInPools = isCollectibleInItemPool(
      CollectibleType.MAGIC_MUSHROOM,
      ItemPoolType.TREASURE,
    );
    const miniMushStillInPools = isCollectibleInItemPool(
      CollectibleType.MINI_MUSH,
      ItemPoolType.TREASURE,
    );
    if (magicMushroomStillInPools && miniMushStillInPools) {
      const collectibleChance = getRandom(rng);
      const collectibleType =
        collectibleChance < 0.5
          ? CollectibleType.MAGIC_MUSHROOM // 12
          : CollectibleType.MINI_MUSH; // 71
      spawnCollectible(collectibleType, position, rng);
      return true;
    }

    if (magicMushroomStillInPools) {
      spawnCollectible(CollectibleType.MINI_MUSH, position, rng);
      return true;
    }

    if (miniMushStillInPools) {
      spawnCollectible(CollectibleType.MAGIC_MUSHROOM, position, rng);
      return true;
    }

    return false;
  }

  // Since the detrimental effect is the final option, we don't need to check the chance.
  game.Fart(position);
  game.ButterBeanFart(position, FART_RADIUS, undefined);
  spawnEffectWithSeed(EffectVariant.FART, 0, position, rng);
  return true;
}

function spawnRockAltRewardSkull(position: Vector, rng: RNG): boolean {
  const chance = getRandom(rng);
  let totalChance = 0;

  totalChance += ROCK_ALT_CHANCES.NOTHING;
  if (chance < totalChance) {
    return false;
  }

  totalChance += ROCK_ALT_CHANCES.BASIC_DROP;
  if (chance < totalChance) {
    spawnCardWithSeed(Card.NULL, position, rng);
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.TRINKET;
  if (chance < totalChance) {
    spawnHeartWithSeed(HeartSubType.BLACK, position, rng);
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.COLLECTIBLE;
  if (chance < totalChance) {
    const ghostBabyStillInPools = isCollectibleInItemPool(
      CollectibleType.GHOST_BABY,
      ItemPoolType.TREASURE,
    );
    const dryBabyStillInPools = isCollectibleInItemPool(
      CollectibleType.DRY_BABY,
      ItemPoolType.TREASURE,
    );
    if (ghostBabyStillInPools && dryBabyStillInPools) {
      const collectibleChance = getRandom(rng);
      const collectibleType =
        collectibleChance < 0.5
          ? CollectibleType.GHOST_BABY // 163
          : CollectibleType.DRY_BABY; // 265
      spawnCollectible(collectibleType, position, rng);
      return true;
    }

    if (ghostBabyStillInPools) {
      spawnCollectible(CollectibleType.DRY_BABY, position, rng);
      return true;
    }

    if (dryBabyStillInPools) {
      spawnCollectible(CollectibleType.GHOST_BABY, position, rng);
      return true;
    }

    return false;
  }

  // Since the detrimental effect is the final option, we don't need to check the chance.
  spawnNPCWithSeed(EntityType.HOST, 0, 0, position, rng);
  return true;
}

function spawnRockAltRewardPolyp(position: Vector, rng: RNG): boolean {
  const chance = getRandom(rng);
  let totalChance = 0;

  totalChance += ROCK_ALT_CHANCES.NOTHING;
  if (chance < totalChance) {
    return false;
  }

  totalChance += ROCK_ALT_CHANCES.BASIC_DROP;
  if (chance < totalChance) {
    spawnHeartWithSeed(HeartSubType.NULL, position, rng);
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.TRINKET;
  if (chance < totalChance) {
    spawnTrinketWithSeed(TrinketType.UMBILICAL_CORD, position, rng);
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.COLLECTIBLE;
  if (chance < totalChance) {
    const placentaStillInPools = isCollectibleInItemPool(
      CollectibleType.PLACENTA,
      ItemPoolType.BOSS,
    );
    const bloodClotStillInPools = isCollectibleInItemPool(
      CollectibleType.BLOOD_CLOT,
      ItemPoolType.BOSS,
    );
    if (bloodClotStillInPools && placentaStillInPools) {
      const collectibleChance = getRandom(rng);
      const collectibleType =
        collectibleChance < 0.5
          ? CollectibleType.PLACENTA // 218
          : CollectibleType.BLOOD_CLOT; // 254
      spawnCollectible(collectibleType, position, rng);
      return true;
    }

    if (bloodClotStillInPools) {
      spawnCollectible(CollectibleType.MINI_MUSH, position, rng);
      return true;
    }

    if (placentaStillInPools) {
      spawnCollectible(CollectibleType.MAGIC_MUSHROOM, position, rng);
      return true;
    }

    return false;
  }

  // Since the detrimental effect is the final option, we don't need to check the chance.
  spawnEffectWithSeed(EffectVariant.CREEP_RED, 0, position, rng);
  fireProjectilesInCircle(
    undefined,
    position,
    POLYP_PROJECTILE_SPEED,
    POLYP_NUM_PROJECTILES,
  );

  return true;
}

function spawnRockAltRewardBucketDownpour(position: Vector, rng: RNG): boolean {
  const chance = getRandom(rng);
  let totalChance = 0;

  totalChance += ROCK_ALT_CHANCES.NOTHING;
  if (chance < totalChance) {
    return false;
  }

  totalChance += ROCK_ALT_CHANCES.BASIC_DROP;
  if (chance < totalChance) {
    const numCoinsChance = getRandom(rng);
    const numCoins = numCoinsChance < 0.5 ? 1 : 2;
    repeat(numCoins, () => {
      const randomVector = getRandomVector(rng);
      const velocity = randomVector.mul(COIN_VELOCITY_MULTIPLIER);
      spawnCoinWithSeed(CoinSubType.NULL, position, rng, velocity);
    });
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.TRINKET;
  if (chance < totalChance) {
    spawnTrinketWithSeed(TrinketType.SWALLOWED_PENNY, position, rng);
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.COLLECTIBLE;
  if (chance < totalChance) {
    const stillInPools = isCollectibleInItemPool(
      CollectibleType.LEECH,
      ItemPoolType.TREASURE,
    );
    if (stillInPools) {
      spawnCollectible(CollectibleType.LEECH, position, rng);
      return true;
    }

    return false;
  }

  // Since the detrimental effect is the final option, we don't need to check the chance.
  const enemiesChance = getRandom(rng);
  const entityType =
    enemiesChance < 0.5 ? EntityType.SPIDER : EntityType.SMALL_LEECH;

  const numEnemiesChance = getRandom(rng);
  const numEnemies = numEnemiesChance < 0.5 ? 1 : 2;
  const jumpDistance = DISTANCE_OF_GRID_TILE * 3;
  repeat(numEnemies, () => {
    const randomVector = getRandomVector(rng);
    const offset = randomVector.mul(jumpDistance);
    const targetPos = position.add(offset);
    // If the room has water, Spiders will automatically be replaced with Striders.
    const spider = EntityNPC.ThrowSpider(
      position,
      undefined,
      targetPos,
      false,
      0,
    );

    // There is no `ThrowLeech` function exposed in the API, so we can piggyback off of the
    // `ThrowSpider` method.
    if (entityType === EntityType.SMALL_LEECH && spider.Type !== entityType) {
      spider.Morph(entityType, 0, 0, -1);
    }
  });

  return true;
}

function spawnRockAltRewardBucketDross(position: Vector, rng: RNG): boolean {
  const chance = getRandom(rng);
  let totalChance = 0;

  totalChance += ROCK_ALT_CHANCES.NOTHING;
  if (chance < totalChance) {
    return false;
  }

  totalChance += ROCK_ALT_CHANCES.BASIC_DROP;
  if (chance < totalChance) {
    const numCoinsChance = getRandom(rng);
    const numCoins = numCoinsChance < 0.5 ? 1 : 2;
    repeat(numCoins, () => {
      const randomVector = getRandomVector(rng);
      const velocity = randomVector.mul(COIN_VELOCITY_MULTIPLIER);
      spawnCoinWithSeed(CoinSubType.NULL, position, rng, velocity);
    });
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.TRINKET;
  if (chance < totalChance) {
    spawnTrinketWithSeed(TrinketType.BUTT_PENNY, position, rng);
    return true;
  }

  totalChance += ROCK_ALT_CHANCES.COLLECTIBLE;
  if (chance < totalChance) {
    const stillInPools = isCollectibleInItemPool(
      CollectibleType.POOP,
      ItemPoolType.TREASURE,
    );
    if (stillInPools) {
      spawnCollectible(CollectibleType.POOP, position, rng);
      return true;
    }

    return false;
  }

  // Since the detrimental effect is the final option, we don't need to check the chance.
  const enemiesChance = getRandom(rng);
  const entityType =
    enemiesChance < 0.5 ? EntityType.DRIP : EntityType.SMALL_LEECH;

  const numEnemiesChance = getRandom(rng);
  const numEnemies = numEnemiesChance < 0.5 ? 1 : 2;
  const jumpDistance = DISTANCE_OF_GRID_TILE * 3;
  repeat(numEnemies, () => {
    const randomVector = getRandomVector(rng);
    const offset = randomVector.mul(jumpDistance);
    const targetPos = position.add(offset);
    const spider = EntityNPC.ThrowSpider(
      position,
      undefined,
      targetPos,
      false,
      0,
    );

    // There is no `ThrowLeech` or `ThrowDrip` functions exposed in the API, so we can piggyback off
    // of the `ThrowSpider` method.
    spider.Morph(entityType, 0, 0, -1);
  });

  return true;
}

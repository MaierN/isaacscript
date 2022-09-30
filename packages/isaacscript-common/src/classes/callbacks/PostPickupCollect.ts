import { ModCallback } from "isaac-typescript-definitions";
import { ModCallbackCustom2 } from "../../enums/ModCallbackCustom2";
import { getClosestPlayer } from "../../functions/players";
import { CustomCallbackPickup } from "./validation/CustomCallbackPickup";

export class PostPickupCollect extends CustomCallbackPickup<ModCallbackCustom2.POST_PICKUP_COLLECT> {
  public override v = {
    room: {
      firedSet: new Set<PtrHash>(),
    },
  };

  constructor() {
    super();

    this.callbacksUsed = [
      [ModCallback.POST_PICKUP_RENDER, [this.postPickupRender]], // 36
    ];
  }

  // ModCallback.POST_PICKUP_RENDER (36)
  private postPickupRender = (pickup: EntityPickup) => {
    const sprite = pickup.GetSprite();
    const animation = sprite.GetAnimation();
    if (animation !== "Collect") {
      return;
    }

    const index = GetPtrHash(pickup);
    if (!this.v.room.firedSet.has(index)) {
      this.v.room.firedSet.add(index);

      const player = getClosestPlayer(pickup.Position);
      this.fire(pickup, player);
    }
  };
}
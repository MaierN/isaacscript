import { ModCallback } from "isaac-typescript-definitions";
import { ModCallbackCustom2 } from "../../enums/ModCallbackCustom2";
import { getPlayers, isChildPlayer } from "../../functions/playerIndex";
import { inGenesisRoom } from "../../functions/rooms";
import { CustomCallbackPlayer } from "./validation/CustomCallbackPlayer";

export class PostPlayerInitFirst extends CustomCallbackPlayer<ModCallbackCustom2.POST_PLAYER_INIT_FIRST> {
  constructor() {
    super();

    this.callbacksUsed = [
      [ModCallback.POST_NEW_ROOM, [this.postNewRoom]], // 19
    ];

    this.customCallbacksUsed = [
      [ModCallbackCustom2.POST_PLAYER_INIT_LATE, [this.postPlayerInitLate]],
    ];
  }

  // ModCallbackCustom.POST_NEW_ROOM_REORDERED
  private postNewRoom = () => {
    // When a player uses the Genesis collectible, they will lose all of their collectibles,
    // trinkets, pocket items, and stats, so they will need to be re-initialized like they would be
    // at the beginning of a run. However, in this case, the `POST_PLAYER_INIT_FIRST` callback will
    // not fire, because that only fires once per run. Thus, we explicitly handle this special case.
    if (!inGenesisRoom()) {
      return;
    }

    for (const player of getPlayers()) {
      this.fire(player);
    }
  };

  // ModCallbackCustom.POST_PLAYER_INIT_LATE
  private postPlayerInitLate = (player: EntityPlayer) => {
    // We want to exclude non-real players like the Strawman keeper.
    if (!isChildPlayer(player)) {
      return;
    }

    this.fire(player);
  };
}

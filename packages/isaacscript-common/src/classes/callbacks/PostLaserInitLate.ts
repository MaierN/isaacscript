import { ModCallback } from "isaac-typescript-definitions";
import { ModCallbackCustom2 } from "../../enums/ModCallbackCustom2";
import { CustomCallbackLaser } from "./validation/CustomCallbackLaser";

export class PostLaserInitLate extends CustomCallbackLaser<ModCallbackCustom2.POST_LASER_INIT_LATE> {
  public override v = {
    room: {
      firedSet: new Set<PtrHash>(),
    },
  };

  constructor() {
    super();

    this.callbacksUsed = [
      [ModCallback.POST_LASER_UPDATE, [this.postLaserUpdate]], // 51
    ];
  }

  // ModCallback.POST_LASER_UPDATE (48)
  private postLaserUpdate = (laser: EntityLaser) => {
    const index = GetPtrHash(laser);
    if (!this.v.room.firedSet.has(index)) {
      this.v.room.firedSet.add(index);
      this.fire(laser);
    }
  };
}
import { ISCFeature } from "../../enums/ISCFeature";
import { ModCallbackCustom2 } from "../../enums/ModCallbackCustom2";
import { CustomCallbackPlayer } from "./validation/CustomCallbackPlayer";

export class PostPEffectUpdateReordered extends CustomCallbackPlayer<ModCallbackCustom2.POST_PEFFECT_UPDATE_REORDERED> {
  constructor() {
    super();

    this.featuresUsed = [ISCFeature.PLAYER_REORDERED_CALLBACKS];
  }
}
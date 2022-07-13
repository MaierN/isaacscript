// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT EDIT THIS FILE!

/**
 * This is the format of a custom stage in the "isaacscript" section of the "tsconfig.json" file.
 *
 * The contents of this interface are used to create a "tsconfig-isaacscript-section-schema.json"
 * schema with the "ts-json-schema-generator" library.
 *
 * The contents of this interface are validated at run-time against the schema using the Ajv
 * library.
 *
 * The `CustomStageLua` interface extends this, adding room metadata.
 */

// ts-prune-ignore-next
export interface CustomStageTSConfig {
  /** The name of the custom stage. Mandatory. */
  readonly name: string;

  /**
   * Path to the XML file that contains the rooms for the custom stage (created with Basement
   * Renovator). Mandatory.
   */
  readonly xmlPath: string;

  /** An arbitrarily chosen prefix in the range of 101-999. Mandatory. */
  readonly roomVariantPrefix: number;

  /**
   * An integer between 1 and 13, corresponding to the `LevelStage` enum. This is the number of the
   * stage that will be warped to and used as a basis for the stage by the level generation
   * algorithm. Mandatory.
   */
  readonly baseStage: number;

  /**
   * An integer between 0 and 5, corresponding to the `StageType` enum. This is the number of the
   * stage type that will be warped to and used as a basis for the stage by the level generation
   * algorithm. Mandatory.
   */
  readonly baseStageType: number;

  /**
   * An object containing the paths to the backdrop for the stage. (A backdrop is the graphics for
   * the walls and floor.) Optional. If not specified, no backdrop will be used. (There will be no
   * walls and no floor.)
   */
  readonly backdrop?: CustomStageBackdrop;
}

interface CustomStageBackdrop {
  /**
   * The beginning of the path that leads to the backdrop graphics. For example:
   *
   * ```sh
   * gfx/backdrop/revelations/revelations_
   * ```
   */
  prefix: string;

  /**
   * The end of the path that leads to the backdrop graphics. In most cases, this will be ".png".
   */
  suffix: string;

  /**
   * An array of strings that represent the graphic files for the stage's "nFloor". You must have at
   * least one string in this array, but you can specify more than one to randomly add extra
   * variety.
   *
   * For an example of this, see the vanilla file "resources/gfx/backdrop/01_basement_nfloor.png".
   */
  nFloors: string[];

  /**
   * An array of strings that represent the graphic files for the stage's "lFloor". You must have at
   * least one in the array, but you can specify more than one to randomly add extra variety.
   *
   * For an example of this, see the vanilla file "resources/gfx/backdrop/01_lbasementfloor.png".
   */
  lFloors: string[];

  /**
   * An array of strings that represent the graphic files for the stage's walls. You must have at
   * least one string in this array, but you can specify more than one to randomly add extra
   * variety.
   *
   * For an example of this, see the vanilla file "resources/gfx/backdrop/01_basement.png". (In the
   * vanilla file, they concatenate all four variations together into one PNG file. However, for the
   * custom stages feature, you must separate each wall variation into a separate file.)
   */
  walls: string[];

  /**
   * An array of strings that represent the graphic files for the stage's corners. You must have at
   * least one string in this array, but you can specify more than one to randomly add extra
   * variety.
   *
   * For an example of this, see the vanilla file "resources/gfx/backdrop/01_basement.png". (In the
   * vanilla file, they concatenate both variations together into one PNG file and put it in the top
   * right hand corner. The corners are shown in the top right hand corner of the file, with two
   * different variations concatenated together. However, for the custom stages feature, you must
   * separate each corner variation into a separate file (and put it in a different file from the
   * walls).
   */
  corners: string[];
}

/**
 * An object that represents a custom stage. The "metadata.lua" file contains an array of these
 * objects. Besides the room metadata, the data is the same as what is specified inside the
 * "tsconfig.json" file.
 *
 * The `CustomStage` interface extends this, adding more data.
 */
export interface CustomStageLua extends CustomStageTSConfig {
  readonly roomsMetadata: readonly CustomStageRoomMetadata[];
}

/**
 * Metadata about a custom stage room. Each custom stage object contains an array with metadata for
 * each room.
 */
export interface CustomStageRoomMetadata {
  readonly type: number;
  readonly variant: number;
  readonly subType: number;
  readonly shape: number;
  readonly doorSlotFlags: number;
  readonly weight: number;
}

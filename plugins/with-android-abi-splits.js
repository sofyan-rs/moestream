const { withAppBuildGradle } = require("@expo/config-plugins");

/**
 * Enable split APKs per ABI in React Native's generated app/build.gradle.
 * This keeps the setting persistent across `expo prebuild`.
 */
module.exports = function withAndroidAbiSplits(config) {
  return withAppBuildGradle(config, (configMod) => {
    let src = configMod.modResults.contents;

    // Old RN template: toggle the existing flag.
    if (src.includes("def enableSeparateBuildPerCPUArchitecture = true")) {
      return configMod;
    }

    if (src.includes("def enableSeparateBuildPerCPUArchitecture = false")) {
      configMod.modResults.contents = src.replace(
        "def enableSeparateBuildPerCPUArchitecture = false",
        "def enableSeparateBuildPerCPUArchitecture = true"
      );
      return configMod;
    }

    // New RN/Expo template: no flag exists, inject an ABI splits block.
    if (src.includes("splits {") && src.includes("abi {")) {
      return configMod;
    }

    const abiSplitsBlock = `    splits {
        abi {
            reset()
            enable true
            universalApk false
            include(*(findProperty("reactNativeArchitectures")?.split(",") ?: ["armeabi-v7a", "arm64-v8a", "x86", "x86_64"]))
        }
    }
`;

    if (src.includes("    packagingOptions {")) {
      src = src.replace("    packagingOptions {", `${abiSplitsBlock}    packagingOptions {`);
      configMod.modResults.contents = src;
      return configMod;
    }

    throw new Error("Could not inject ABI splits block into android/app/build.gradle");
  });
};

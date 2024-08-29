const currentVersion = "1.0"; // Update this when you release a new version
const versionInfoUrl =
  "https://raw.githubusercontent.com/liamlenholm/Shopify-VAT-Margin-Calculator-Chrome-Extension/main/version.json";
const repoUrl =
  "https://github.com/liamlenholm/Shopify-VAT-Margin-Calculator-Chrome-Extension";

async function checkVersion() {
  try {
    const response = await fetch(versionInfoUrl);
    const data = await response.json();
    const latestVersion = data.version;

    document.getElementById("current-version").textContent = currentVersion;

    if (currentVersion !== latestVersion) {
      const versionInfo = document.getElementById("version-info");
      versionInfo.innerHTML += ` - <a href="${repoUrl}" target="_blank">Update available (${latestVersion})</a>`;
      versionInfo.style.color = "red";
    }
  } catch (error) {
    console.error("Error checking version:", error);
  }
}

document.addEventListener("DOMContentLoaded", checkVersion);

document.addEventListener("DOMContentLoaded", async function () {
  const {
    vatRate = 25,
    greenThreshold = 30,
    yellowThreshold = 20,
  } = await chrome.storage.sync.get([
    "vatRate",
    "greenThreshold",
    "yellowThreshold",
  ]);
  document.getElementById("vat").value = vatRate;
  document.getElementById("greenThreshold").value = greenThreshold;
  document.getElementById("yellowThreshold").value = yellowThreshold;

  document.getElementById("save").addEventListener("click", async function () {
    var vatRate = parseFloat(document.getElementById("vat").value);
    var greenThreshold = parseFloat(
      document.getElementById("greenThreshold").value
    );
    var yellowThreshold = parseFloat(
      document.getElementById("yellowThreshold").value
    );

    await chrome.storage.sync.set({ vatRate, greenThreshold, yellowThreshold });
    window.close();
  });
});

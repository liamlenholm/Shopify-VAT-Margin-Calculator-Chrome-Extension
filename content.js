let vatRate = 0.25;
let greenThreshold = 30;
let yellowThreshold = 20;

chrome.storage.sync.get(
  ["vatRate", "greenThreshold", "yellowThreshold"],
  function (data) {
    if (data.vatRate) {
      vatRate = data.vatRate / 100;
    }
    if (data.greenThreshold) {
      greenThreshold = data.greenThreshold;
    }
    if (data.yellowThreshold) {
      yellowThreshold = data.yellowThreshold;
    }
  }
);

const MarginCalculator = {
  calculateMargin(priceWithVAT, costWithoutVAT, vatRate) {
    const priceWithoutVAT = priceWithVAT / (1 + vatRate);
    const margin = ((priceWithoutVAT - costWithoutVAT) / priceWithoutVAT) * 100;
    const profit = priceWithoutVAT - costWithoutVAT;
    return { margin, profit };
  },

  getMarginColor(margin) {
    if (margin >= greenThreshold) return "green";
    if (margin >= yellowThreshold) return "#DAA520";
    return "red";
  },
};

function calculateAndDisplayMargin() {
  const priceInput = document.querySelector('input[name="price"]');
  const costInput = document.querySelector('input[name="unitCost"]');

  if (priceInput && costInput) {
    const priceWithVAT = parseFloat(
      priceInput.value
        .replace(/\s/g, "")
        .replace(/&nbsp;/g, "")
        .replace(",", ".")
    );
    const costWithoutVAT = parseFloat(
      costInput.value
        .replace(/\s/g, "")
        .replace(/&nbsp;/g, "")
        .replace(",", ".")
    );

    if (
      !isNaN(priceWithVAT) &&
      !isNaN(costWithoutVAT) &&
      costWithoutVAT !== 0
    ) {
      const marginInfo = MarginCalculator.calculateMargin(
        priceWithVAT,
        costWithoutVAT,
        vatRate
      );
      const margin = marginInfo.margin;
      const profit = marginInfo.profit;
      const marginColor = MarginCalculator.getMarginColor(margin);
      const profitColor = profit > 0 ? "green" : "red";

      let marginDisplay = document.getElementById("shopify-margin-display");
      if (!marginDisplay) {
        marginDisplay = document.createElement("div");
        marginDisplay.id = "shopify-margin-display";
        costInput
          .closest(".Polaris-LegacyCard__Section")
          .appendChild(marginDisplay);
      }

      marginDisplay.innerHTML = `
      <div class="margin-info" style="color: ${marginColor};">
        <span class="label">Margin:</span>
        <span class="value">${margin.toFixed(2)}%</span>
      </div>
      <div class="profit-info" style="color: ${profitColor};">
        <span class="label">Profit:</span>
        <span class="value">${profit.toFixed(2)} kr</span>
      </div>
    `;
    }
  }
}

function observeInputChanges() {
  const priceInput = document.querySelector('input[name="price"]');
  const costInput = document.querySelector('input[name="unitCost"]');

  if (priceInput && costInput) {
    const observer = new MutationObserver(calculateAndDisplayMargin);
    observer.observe(priceInput, {
      attributes: true,
      attributeFilter: ["value"],
    });
    observer.observe(costInput, {
      attributes: true,
      attributeFilter: ["value"],
    });

    priceInput.addEventListener("input", calculateAndDisplayMargin);
    costInput.addEventListener("input", calculateAndDisplayMargin);

    calculateAndDisplayMargin();
  } else {
    setTimeout(observeInputChanges, 1000);
  }
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.vatRate) {
    vatRate = changes.vatRate.newValue / 100;
  }
  if (changes.greenThreshold) {
    greenThreshold = changes.greenThreshold.newValue;
  }
  if (changes.yellowThreshold) {
    yellowThreshold = changes.yellowThreshold.newValue;
  }
  calculateAndDisplayMargin();
});

observeInputChanges();

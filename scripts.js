document.getElementById("add-reason").addEventListener("click", function () {
    const reasonFields = document.getElementById("reason-fields");
    const newReason = document.createElement("div");
    newReason.className = "reason";

    newReason.innerHTML = `
        <label>根拠:</label>
        <select>
            <option value="fibonacci">フィボナッチ</option>
            <option value="elliott">エリオット波動</option>
            <option value="line-analysis">ライン分析</option>
            <option value="chart-pattern">チャートパターン</option>
            <option value="ma">MA</option>
            <option value="bb">BB</option>
            <option value="ichimoku">一目均衡表</option>
            <option value="candlestick">ローソク足</option>
            <option value="oscillators">オシレーター系</option>
            <option value="other">その他</option>
        </select>
        <textarea placeholder="詳細を入力してください"></textarea>
        <button class="remove-reason">削除</button>
    `;

    reasonFields.appendChild(newReason);
});

document.getElementById("reason-fields").addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-reason")) {
        e.target.parentElement.remove();
    }
});

document.querySelectorAll("#timeframe, #currency").forEach(select => {
    select.addEventListener("change", function (e) {
        const otherInputId = `${e.target.id}-other`;
        const otherInput = document.getElementById(otherInputId);

        if (otherInput) {
            if (e.target.value === "other") {
                otherInput.style.display = "block";
            } else {
                otherInput.style.display = "none";
                otherInput.value = "";
            }
        }
    });
});

document.getElementById("calculate").addEventListener("click", function () {
    const entryPrice = parseFloat(document.getElementById("entry-price").value) || 0;
    const tpPrice = parseFloat(document.getElementById("tp-price").value) || 0;
    const slPrice = parseFloat(document.getElementById("sl-price").value) || 0;
    const currency = document.getElementById("currency").value;

    let tpPips = "";
    let slPips = "";

    if (tpPrice && entryPrice) {
        const tpBase = Math.abs(tpPrice - entryPrice);
        tpPips = currency === "usd_jpy" ? tpBase * 100 : currency === "nikkei" ? tpBase : "";
    }

    if (slPrice && entryPrice) {
        const slBase = Math.abs(slPrice - entryPrice);
        slPips = currency === "usd_jpy" ? slBase * 100 : currency === "nikkei" ? slBase : "";
    }

    document.getElementById("tp-pips").textContent = tpPips ? `${tpPips.toFixed(1)} pips` : "";
    document.getElementById("sl-pips").textContent = slPips ? `${slPips.toFixed(1)} pips` : "";

    if (tpPips && slPips) {
        const rr1 = (slPips / slPips).toFixed(0);
        const rr2 = (tpPips / slPips).toFixed(1);
        document.getElementById("risk-reward").textContent = `${rr1}:${rr2}`;
    } else {
        document.getElementById("risk-reward").textContent = "";
    }
});

document.getElementById("generate-output").addEventListener("click", function () {
    const output = document.getElementById("output");

    const timeframe = document.getElementById("timeframe").value === "other" ? document.getElementById("timeframe-other").value : document.getElementById("timeframe").value;
    const currency = document.getElementById("currency").value === "other" ? document.getElementById("currency-other").value : document.getElementById("currency").value;
    const tradeType = document.getElementById("trade-type").value;
    const tradeResult = document.getElementById("trade-result").value;
    const feedback = document.getElementById("feedback").value;

    const reasons = Array.from(document.querySelectorAll("#reason-fields .reason"))
        .map(reason => {
            const selectValue = reason.querySelector("select").value;
            const textarea = reason.querySelector("textarea").value;
            return `・${selectValue}:\n　${textarea}`;
        })
        .join("\n");

    output.textContent = `出力日時: ${new Date().toLocaleString()}\n結果: ${tradeResult}\n\n【エントリー基本情報】\n・通貨ペア: ${currency}\n・エントリー種別: ${tradeType}\n・メイン時間足: ${timeframe}\n\n【使った根拠・分析】\n${reasons}\n\n【見解・感想】\n${feedback}`;
});

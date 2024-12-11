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
        const otherInput = document.getElementById(`${e.target.id}-other`);
        if (e.target.value === "other") {
            otherInput.style.display = "block";
        } else {
            otherInput.style.display = "none";
            otherInput.value = "";
        }
    });
});

document.getElementById("generate-output").addEventListener("click", function () {
    const output = document.getElementById("output");

    // Collect data from the form
    const timeframe = document.getElementById("timeframe").value === "other" ? document.getElementById("timeframe-other").value : document.getElementById("timeframe").value;
    const currency = document.getElementById("currency").value === "other" ? document.getElementById("currency-other").value : document.getElementById("currency").value;
    const tradeType = document.getElementById("trade-type").value;
    const tradeResult = document.getElementById("trade-result").value;
    const feedback = document.getElementById("feedback").value;

    const reasons = Array.from(document.querySelectorAll("#reason-fields .reason"))
        .map(reason => {
            const select = reason.querySelector("select").value;
            const textarea = reason.querySelector("textarea").value;
            return `・${select}: ${textarea}`;
        })
        .join("\n");

    // Output the formatted result
    output.textContent = `出力日時: ${new Date().toLocaleString()}\n結果: ${tradeResult}\n\n【エントリー基本情報】\n・通貨ペア: ${currency}\n・エントリー種別: ${tradeType}\n・メイン時間足: ${timeframe}\n\n【使った根拠・分析】\n${reasons}\n\n【見解・感想】\n${feedback}`;
});

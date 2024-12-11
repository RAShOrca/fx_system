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

document.getElementById("generate-output").addEventListener("click", function () {
    const output = document.getElementById("output");

    // Collect data from the form
    const timeframe = document.getElementById("timeframe").value;
    const currencies = Array.from(document.querySelectorAll("input[name='currency']:checked"))
        .map(input => input.nextSibling.nodeValue.trim())
        .join(", ");
    const tradeType = Array.from(document.querySelectorAll("input[name='trade_type']:checked"))
        .map(input => input.nextSibling.nodeValue.trim())
        .join(", ");
    const tradeResult = Array.from(document.querySelectorAll("input[name='trade_result']:checked"))
        .map(input => input.nextSibling.nodeValue.trim())
        .join(", ");
    const feedback = document.getElementById("feedback").value;

    const reasons = Array.from(document.querySelectorAll("#reason-fields .reason"))
        .map(reason => {
            const select = reason.querySelector("select").value;
            const textarea = reason.querySelector("textarea").value;
            return `・${select}: ${textarea}`;
        })
        .join("\n");

    // Output the formatted result
    output.textContent = `出力日時: ${new Date().toLocaleString()}\n結果: ${tradeResult}\n\n【エントリー基本情報】\n・通貨ペア: ${currencies}\n・エントリー種別: ${tradeType}\n・メイン時間足: ${timeframe}\n\n【使った根拠・分析】\n${reasons}\n\n【見解・感想】\n${feedback}`;
});

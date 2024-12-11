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

document.getElementById("generate-output").addEventListener("click", function () {
    const output = document.getElementById("output");

    // 値のマッピング（変換）
    const tradeResultMap = { win: "勝ち", lose: "負け" };
    const currencyMap = { usd_jpy: "ドル円", nikkei: "日経" };
    const tradeTypeMap = { buy: "買い", sell: "売り" };
    const reasonMap = {
        uptrend: "ダウ（上昇）",
        downtrend: "ダウ（下降）",
        range: "ダウ（もみ合い）",
        fibonacci: "フィボナッチ",
        elliott: "エリオット波動",
        "line-analysis": "ライン分析",
        "chart-pattern": "チャートパターン",
        ma: "MA",
        bb: "ボリンジャーバンド",
        ichimoku: "一目均衡表",
        candlestick: "ローソク足",
        oscillators: "オシレーター系",
        other: "その他",
    };

    // 入力データを取得
    const timeframe = document.getElementById("timeframe").value === "other" ? document.getElementById("timeframe-other").value : document.getElementById("timeframe").value;
    const currency = document.getElementById("currency").value === "other" ? document.getElementById("currency-other").value : currencyMap[document.getElementById("currency").value] || document.getElementById("currency").value;
    const tradeType = tradeTypeMap[document.getElementById("trade-type").value];
    const tradeResult = tradeResultMap[document.getElementById("trade-result").value];
    const feedback = document.getElementById("feedback").value;

    const reasons = Array.from(document.querySelectorAll("#reason-fields .reason"))
        .map(reason => {
            const selectValue = reason.querySelector("select").value;
            const reasonName = reasonMap[selectValue] || selectValue;
            const textarea = reason.querySelector("textarea").value;
            return `・${reasonName}:\n　${textarea}`;
        })
        .join("\n");

    // 出力フォーマットに合わせて整形
    output.textContent = `出力日時: ${new Date().toLocaleString()}\n結果: ${tradeResult}\n\n【エントリー基本情報】\n・通貨ペア: ${currency}\n・エントリー種別: ${tradeType}\n・メイン時間足: ${timeframe}\n\n【使った根拠・分析】\n${reasons}\n\n【見解・感想】\n${feedback}`;
});

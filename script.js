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
    const mainPrice = parseFloat(document.getElementById("main-price").value);
    const tpPrice = parseFloat(document.getElementById("tp-price").value);
    const slPrice = parseFloat(document.getElementById("sl-price").value);

    if (isNaN(mainPrice) || isNaN(tpPrice) || isNaN(slPrice)) {
        alert("すべての価格を正しく入力してください。");
        return;
    }

    const currency = document.getElementById("currency").value;
    const tpPips = getPips(tpPrice, mainPrice, currency);
    const slPips = getPips(slPrice, mainPrice, currency);
    document.getElementById("tp-pips").textContent = tpPips ? `(${tpPips} pips)` : "";
    document.getElementById("sl-pips").textContent = slPips ? `(${slPips} pips)` : "";

    if (tpPips && slPips) {
        document.getElementById("risk-reward").textContent = getRiskReward(slPips, tpPips);
    } else {
        document.getElementById("risk-reward").textContent = "(0:0)";
    }
});

document.getElementById("generate-output").addEventListener("click", function () {
    const reasonMap = {
        uptrend: "ダウ（上昇）",
        downtrend: "ダウ（下降）",
        range: "ダウ（もみ合い）",
        fibonacci: "フィボナッチ",
        elliott: "エリオット",
        "line-analysis": "ライン分析",
        "chart-pattern": "チャートパターン",
        ma: "移動平均線",
        bb: "ボリンジャーバンド",
        ichimoku: "一目均衡表",
        candlestick: "ローソク足",
        oscillators: "オシレーター系",
        other: "その他",
    };
    const requiredFields = ["main-price", "tp-price", "sl-price", "lot-size"];
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value) {
            alert("エントリー価格情報は全て入力してください。");
            return;
        }
    }

    const output = document.getElementById("output");
    const tradeResultMap = { win: "勝ち", lose: "負け" };
    const currencyMap = { usd_jpy: "ドル円", nikkei: "日経" };
    const tradeTypeMap = { buy: "買い", sell: "売り" };
    const feedback = document.getElementById("feedback").value;
    const reasons = Array.from(document.querySelectorAll("#reason-fields .reason"))
    .map(reason => {
        const selectValue = reason.querySelector("select").value;
        const reasonName = reasonMap[selectValue] || selectValue;
        const textarea = reason.querySelector("textarea").value;
        
        // テキストエリアの内容を行ごとに「　」をつけて整形
        const formattedText = textarea.split("\n").map(line => `　${line}`).join("\n");
        
        return `・${reasonName}:\n${formattedText}`;
    })
    .join("\n");

    const timeframe = document.getElementById("timeframe").value;
    const currency = document.getElementById("currency").value;
    const tradeType = document.getElementById("trade-type").value;
    const tradeResult = document.getElementById("trade-result").value;
    const lotSize = document.getElementById("lot-size").value;
    const mainPrice = document.getElementById("main-price").value;
    const tpPrice = document.getElementById("tp-price").value;
    const slPrice = document.getElementById("sl-price").value;

    const tpPips = getPips(parseFloat(tpPrice), parseFloat(mainPrice), currency);
    const slPips = getPips(parseFloat(slPrice), parseFloat(mainPrice), currency);
    const riskReward = getRiskReward(slPips, tpPips);

    if(tpPips && slPips && riskReward){
        output.textContent = `作成日: ${new Date().toLocaleString()}
結果: ${tradeResultMap[tradeResult]}

【エントリー基本情報】
・通貨ペア: ${currencyMap[currency] || currency}
・エントリー種別: ${tradeTypeMap[tradeType]}
・メイン時間足: ${timeframe}

【エントリー価格情報】
・Lot数: ${lotSize}
・エントリー価格: ${mainPrice}
・TP価格(${tpPips}pips): ${tpPrice}
・SL価格(${slPips}pips): ${slPrice}
・リスクリワード: ${riskReward}

【根拠】
${reasons}

【見解・感想】
${feedback}`;
    }else{
        output.textContent = `作成日: ${new Date().toLocaleString()}
結果: ${tradeResultMap[tradeResult]}

【エントリー基本情報】
・通貨ペア: ${currencyMap[currency] || currency}
・エントリー種別: ${tradeTypeMap[tradeType]}
・メイン時間足: ${timeframe}

【エントリー価格情報】
・Lot数: ${lotSize}
・エントリー価格: ${mainPrice}
・TP価格: ${tpPrice}
・SL価格: ${slPrice}

【見解・感想】
${feedback}`;
    }

});

function getPips(targetPrice, entryPrice, currency) {
    if (!targetPrice || !entryPrice) return 0;
    const basePips = Math.abs(targetPrice - entryPrice);
    let pips = 0;

    if (currency === "usd_jpy") {
        pips = basePips * 100;
    } else if (currency === "nikkei") {
        pips = basePips;
    } else {
        return 0;
    }
    return parseFloat(pips).toFixed(1);
}

function getRiskReward(slPips, tpPips) {
    if (!slPips || slPips === 0) return "(0:0)";
    const rr1 = 1;
    const rr2 = (tpPips / slPips).toFixed(1);
    return `(${rr1}：${rr2})`;
}

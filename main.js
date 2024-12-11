function generateText() {
    const time = document.getElementById("timeMenu").value;
    const dau = document.getElementById("dauMenu").value;
    const junBariChecked = document.getElementById("jun").checked;
    const gyakuBariChecked = document.getElementById("gyaku").checked;
    const textarea = document.getElementById("textarea").value;

    let tmpBool;
    if (junBariChecked) {
        tmpBool = '順張り';
    } else if (gyakuBariChecked) {
        tmpBool = '逆張り';
    } else {
        tmpBool = '未確認';
    }

    const result = `時間足: ${time}\nダウ: ${dau}\n確認事項: ${tmpBool}\n根拠: ${textarea}`;
    document.getElementById("output").innerText = result;

    // Create a downloadable file
    const blob = new Blob([result], { type: "text/plain" });
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "output.txt";
    downloadLink.style.display = "inline";
    downloadLink.innerText = "Download Text";
}

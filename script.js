document.addEventListener("DOMContentLoaded", () => {
    const inputNews = document.getElementById("input-news");
    const verifyBtn = document.getElementById("verify");
    const resultDiv = document.querySelector(".results");

    verifyBtn.addEventListener("click", async () => {
        const newsText = inputNews.value.trim();

        if (newsText === "") {
            resultDiv.innerHTML = "<p style='color:red;'>Please enter valid news text! </p>";
            return;
        }

        resultDiv.innerHTML = "<p>Verifying... ⏳</p>";

        try {
            const response = await fetch(`http://localhost:5000/verify?query=${encodeURIComponent(newsText)}`);
            const data = await response.json();

            if (data.claims && data.claims.length > 0) {
                let resultHTML = `<p style='color:green;'>✅ Fact-check results found:</p><ul>`;

                data.claims.forEach((claim) => {
                    const review = claim.claimReview[0]; 
                    resultHTML += `
                        <li>
                            <strong>${claim.text}</strong> <br>
                            <i>Claimed by:</i> ${claim.claimant || "Unknown"} <br>
                            <i>Fact-Check Rating:</i> ${review.textualRating} <br>
                            <i>Source:</i> <a href="${review.url}" target="_blank">${review.publisher.name}</a>
                        </li><br>`;
                });

                resultHTML += "</ul>";
                resultDiv.innerHTML = resultHTML;
            } else {
                resultDiv.innerHTML = "<p style='color:red;'>❌ No reliable sources found for this news!</p>";
            }
        } catch (error) {
            resultDiv.innerHTML = "<p style='color:red;'>⚠️ Error fetching data. Please try again.</p>";
            console.error("Error:", error);
        }
    });
});

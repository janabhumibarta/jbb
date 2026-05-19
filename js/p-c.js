document.addEventListener("DOMContentLoaded", function() {

  const metaTitle = document.title.split('|')[0].trim();
  const postTitleEl = document.querySelector('.post-title') || document.querySelector('h1');
  const finalTitle = postTitleEl ? postTitleEl.innerText : metaTitle;

  const metaImg = document.querySelector("meta[property='og:image']")?.content || "";

  function getPostDate() {
    let dateStr = "";
    const themeDateEl = document.querySelector('.date-format');
    if (themeDateEl) { dateStr = themeDateEl.getAttribute('data-date') || themeDateEl.innerText; }
    if (!dateStr) {
      const metaDate = document.querySelector('meta[property="article:published_time"]') || document.querySelector('meta[itemprop="datePublished"]');
      if (metaDate) dateStr = metaDate.getAttribute("content");
    }
    let finalDate = new Date(); 
    if (dateStr) { let parsed = Date.parse(dateStr); if (!isNaN(parsed)) finalDate = new Date(parsed); }
    return finalDate.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const btn = document.getElementById('btn-gen-pcard');
  if (!btn) return;

  btn.addEventListener('click', async function() {
    const loader = document.getElementById('pc-loader');
    const loaderText = document.getElementById('loader-text');
    
    loader.style.display = "block";
    loaderText.innerHTML = '<i class="fas fa-sync fa-spin"></i> প্রসেসিং হচ্ছে...';
    btn.disabled = true;

    // টাইটেলকে দুই রঙে ভাগ করার লজিক
    const words = finalTitle.split(' ');
    if (words.length > 1) {
      const middleIndex = Math.ceil(words.length / 2);
      const firstPart = words.slice(0, middleIndex).join(' ');
      const secondPart = words.slice(middleIndex).join(' ');
      document.getElementById('pc-target-title').innerHTML = `${firstPart} <span>${secondPart}</span>`;
    } else {
      document.getElementById('pc-target-title').innerText = finalTitle;
    }

    document.getElementById('pc-news-date').innerText = getPostDate();
    
    try { await document.fonts.load('bold 16px "Hind Siliguri"'); await document.fonts.ready; } catch(e) {}

    const imgNode = document.getElementById('pc-target-img');
    imgNode.src = 'https://images.weserv.nl/?url=' + encodeURIComponent(metaImg);

    imgNode.onload = function() {
      setTimeout(() => {
        html2canvas(document.querySelector("#photocard-render-area"), {
          useCORS: true,
          scale: 2
        }).then(canvas => {
          const link = document.createElement('a');
          link.download = 'janabhumibarta-photocard.png';
          link.href = canvas.toDataURL("image/png");
          link.click();

          loaderText.innerHTML = 'ডাউনলোড সম্পন্ন হয়েছে!';
          
          setTimeout(() => {
            loader.style.display = "none";
            btn.disabled = false;
          }, 2000);
        });
      }, 1500); 
    };

    imgNode.onerror = function() {
        alert("ইমেজ লোড হয়নি!");
        loader.style.display = "none";
        btn.disabled = false;
    };
  });
});

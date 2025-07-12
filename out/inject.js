console.log("ALL THE BEST FOR YOUR JOB SEARCH!");

const scrapeInterval = (scrapeFunction) => {
  let lastUrl = window.location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(scrapeFunction, 2000);
    }
  }, 1000);
};

function extractData(titleElem, descElem) {
  if (!titleElem || !descElem) {
    console.warn("Job details not found!");
    return;
  }

  const jobTitle = titleElem.innerText.trim();
  const jobDesc = descElem.innerText.trim();
  const url = window.location.href;
  const hostname = new URL(url).hostname;

  const jobData = {
    hostname,
    link: url,
    title: jobTitle,
    desc: jobDesc,
    timeStamp: new Date().toISOString(),
  };

  chrome.storage.local.set({ scrapedData: jobData }, () => {
    console.log("Job details saved:", jobData);
  });
}

function scrapeInternshalaJob() {
  const titleElem = document.querySelector(".profile");
  const descElem = document.querySelector(".text-container");
  extractData(titleElem, descElem);
}

function scrapeNaukri() {
  const titleElem = document.querySelector(".styles-module_component__3ZI84");
  const descElem = document.querySelector(".styles_description__36q7q");
  extractData(titleElem, descElem);
}
chrome.storage.local.get("scrapedData", (data) => {
  const currentUrl = window.location.href;

  if (!data.scrapedData || data.scrapedData.link !== currentUrl) {
    console.log("No scraped data found for this URL, starting scraping...");
    scrapeInterval(scrapeInternshalaJob);
    scrapeInterval(scrapeNaukri);
    scrapeInternshalaJob();
    scrapeNaukri();
  } else {
    console.log("Scraped data already exists for this URL. Skipping scraping.");
  }
});

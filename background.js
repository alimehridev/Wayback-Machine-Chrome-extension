chrome.action.onClicked.addListener((tab) => {
  const domain = new URL(tab.url).host;
  chrome.tabs.query({}, (tabs) => {
    const existingTab = tabs.find(tab => tab.url && (tab.url.includes(chrome.runtime.id + `/dashboard.html?domain=${encodeURIComponent(domain)}`) || tab.url.includes(chrome.runtime.id + `/dashboard.html?origin_add=${encodeURIComponent(origin)}`) ));
    if(existingTab){
      chrome.tabs.update(existingTab.id, { active: true });
      chrome.windows.update(existingTab.windowId, { focused: true });
    }else{
      const url = chrome.runtime.getURL("dashboard.html") + `?domain=${encodeURIComponent(domain)}`;
      chrome.tabs.create({ url });
    }
  })
});


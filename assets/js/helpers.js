function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function createVirtualList(container, items, { itemHeight, renderItem, buffer = 5 }) {
  const spacer = document.createElement('div');
  const viewportInner = document.createElement('div');
  viewportInner.style.position = 'relative';
  spacer.appendChild(viewportInner);
  container.innerHTML = '';
  container.appendChild(spacer);

  const state = { first: 0, last: -1, nodes: new Map() };

  function setTotalHeight() {
    spacer.style.height = (items.length * itemHeight) + 'px';
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function update() {
    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;

    const start = clamp(Math.floor(scrollTop / itemHeight) - buffer, 0, items.length - 1);
    const end   = clamp(Math.ceil((scrollTop + viewportHeight) / itemHeight) + buffer, 0, items.length - 1);

    if (start === state.first && end === state.last) return;
    state.first = start;
    state.last = end;

    // remove old nodes
    for (const [i, node] of state.nodes) {
      if (i < start || i > end) {
        node.remove();
        state.nodes.delete(i);
      }
    }

    // add needed nodes
    for (let i = start; i <= end; i++) {
      if (!state.nodes.has(i)) {
        if(items[i].length < 2){
            continue
        }
        const el = renderItem(items[i], i);
        el.style.position = 'absolute';
        el.style.top = (i * itemHeight - 20) + 'px';
        el.style.height = itemHeight + 'px';
        viewportInner.appendChild(el);
        state.nodes.set(i, el);
      }
    }
  }

  container.addEventListener('scroll', () => requestAnimationFrame(update));
  window.addEventListener('resize', () => requestAnimationFrame(update));

  setTotalHeight();
  update();
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}

let snapshots_string = ""
document.getElementById("target").value = getQueryParam("domain")

const filterTypes = ["urlkey","timestamp","original","mimetype","statuscode","digest","length"];
const container = document.getElementById('custom-filter-container');
const addBtn = document.getElementById('add-custom-filter');

function createCustomFilterRow() {
  const row = document.createElement('div');
  row.className = 'custom-filter-row';

  // select type
  const select = document.createElement('select');
  filterTypes.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });

  // input value
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter value (can be regex)...';

  // remove button
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = 'X';
  removeBtn.addEventListener('click', () => row.remove());

  row.appendChild(select);
  row.appendChild(input);
  row.appendChild(removeBtn);

  container.appendChild(row);
}

// دکمه افزودن
addBtn.addEventListener('click', createCustomFilterRow);

// مقدار گرفتن از فیلترها
function getCustomFilters() {
  const rows = document.querySelectorAll('.custom-filter-row');
  const filters = [];
  rows.forEach(r => {
    const type = r.querySelector('select').value;
    const value = r.querySelector('input').value.trim();
    
    if(value) {
      filters.push(`filter=${type}:${value}`);
    }
  });
  return filters.join("&");
}

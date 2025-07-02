document.getElementById('fetch-btn').addEventListener('click', fetchCategories);

async function fetchCategories() {
  const regionSelect = document.getElementById('region-select');
  const fetchBtn = document.getElementById('fetch-btn');
  const content = document.getElementById('content');
  const selectedRegion = regionSelect.value;

  if (!selectedRegion) {
    alert('Please select a region first');
    return;
  }

  fetchBtn.disabled = true;
  fetchBtn.textContent = 'Fetching...';
  content.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Fetching categories from ${selectedRegion === 'staging' ? 'Zuper Staging' : 'Zuper Live'}...</p>
    </div>
  `;

  try {
    // const response = await fetch('/api/webhook/4af052e8-ce83-4fe9-a2f6-919703ee50a4', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ region: selectedRegion })
    // });

    const webhookUrl = location.hostname === 'localhost'
  ? '/api/webhook/4af052e8-ce83-4fe9-a2f6-919703ee50a4'
  : 'https://internalwf-dev.zuper.co/webhook/4af052e8-ce83-4fe9-a2f6-919703ee50a4';

const response = await fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ region: selectedRegion })
});


    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    displayCategories(data[0] || data);
  } catch (error) {
    content.innerHTML = `
      <div class="error">
        <h3>Error fetching categories</h3>
        <p>${error.message}</p>
        <p>Please try again or contact support if the problem persists.</p>
      </div>
    `;
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.textContent = 'Fetch Categories';
  }
}

function displayCategories(data) {
  const content = document.getElementById('content');
  const categoryMappings = {
    'job_categories': 'Job Categories',
    'project_categories': 'Project Categories',
    'customer_categories': 'Customer Categories',
    'part_categories': 'Part Categories',
     'product_locations': 'Product Locations',
    'asset_categories': 'Asset Categories',
    'payment_modes': 'Payment Modes',
    'payment_terms': 'Payment Terms',
    'service_tasks': 'Service Tasks'
  };

  let html = '<div class="results">';

  Object.keys(categoryMappings).forEach(key => {
    // if (data[key] && data[key].length > 0) {
    //   html += `
    //     <div class="category-section">
    //       <h2 class="category-title">${categoryMappings[key]}</h2>
    //       <table class="category-table">
    //         <thead>
    //           <tr><th>Category Name</th><th>UUID</th></tr>
    //         </thead><tbody>
    //   `;

    //   data[key].forEach(item => {
    //     const name = Object.keys(item)[0];
    //     const uuid = item[name];
    //     html += `
    //       <tr>
    //         <td class="category-name">${name}</td>
    //         <td><div class="uuid-container">
    //           <span class="uuid">${uuid}</span>
    //           <button class="copy-btn" onclick="navigator.clipboard.writeText('${uuid}')">Copy</button>
    //         </div></td>
    //       </tr>
    //     `;
    //   });

    //   html += `</tbody></table></div>`;
    // }
    if (data[key] && data[key].length > 0) {
    const isUnavailable = data[key].length === 1 && data[key][0] === "Category not available";

    html += `
        <div class="category-section">
            <h2 class="category-title">${categoryMappings[key]}</h2>
    `;

    if (isUnavailable) {
        html += `<p style="padding: 20px; color: #718096;">Category not available</p>`;
    } else {
        html += `
            <table class="category-table">
                <thead>
                    <tr>
                        <th style="width: 40%;">Category Name</th>
                        <th style="width: 60%;">UUID</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data[key].forEach(item => {
            const categoryName = Object.keys(item)[0];
            const uuid = item[categoryName];

            html += `
                <tr>
                    <td class="category-name">${categoryName}</td>
                    <td>
                        <div class="uuid-container">
                            <span class="uuid">${uuid}</span>
                            <button class="copy-btn" onclick="copyToClipboard('${uuid}', this)">Copy</button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;
    }

    html += `</div>`;
}

  });

  html += '</div>';
  content.innerHTML = html;
}

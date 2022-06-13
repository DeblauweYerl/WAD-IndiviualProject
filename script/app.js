let categories = {'business':0, 'entertainment':0, 'health':0, 'science':0, 'sports':0, 'technology':0, 'politics':0};
let categoryValues = [];
let html_categories, innerHTMLcategories;
let keyword_request, html_keywordInput, html_keywordDate, html_addKeyword, html_keywords;

let Key1 = "49017237d5bf4942a6fabc322f9e0ee7";
let Key2 = "cc26c03f571849f18a51b99646a7982c";

let customHeaders = new Headers();

let getAPIs = async function(){
    let url;
    const now = new Date();
    const last_week = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    for (var category in categories) {
        url = `https://newsapi.org/v2/everything?q=${category}&from=${last_week}&apiKey=49017237d5bf4942a6fabc322f9e0ee7`;

        await getByCategory(url, category);
    }
    showResults();
};

const getByCategory = async function(url, category) {
	try {
        const response = await fetch(url, { headers: customHeaders });
		const data = await response.json();
		console.log(data);
		processCategoryData(data, category);
	}
	catch (error) {
		console.error("An error occured: ", error);
	};
};


let processCategoryData = function(data, category) {
    categories[category] = data.totalResults;
    categoryValues.push(data.totalResults);
};

let showResults = function(){
    const categories_sorted = sortDict(categories);
    let max = Math.max(...categoryValues);
    console.log(categories_sorted);
    html_categories.innerHTML = "";
    innerHTMLcategories = "";
    console.log(`max= ${max}`);
    for (var category of categories_sorted) {
        console.log(`categoryKeyValue = ${category[0]} - ${category[1]}`);
        innerHTMLcategories += 
        `<button style="width: ${category[1]/max*100}%;" class="o-button-reset o-layout o-layout--justify-space-between c-categories__item">
            <span class="c-categories__name">${category[0]}</span>
            <svg class="c-arrow"><use xlink:href="#arrow"></use></svg>
            <p class="c-categories__meta">Total articles found: ${category[1]}</p>
        </button>`;
    };
    html_categories.innerHTML += innerHTMLcategories;
};

let sortDict = function(dict) {
    var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
      });
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    return items;
};

let addKeyword = function(keyword) {

};

const getByKeywordDate = async function(url) {
	try {
        const response = await fetch(url, { headers: customHeaders });
		const data = await response.json();
		console.log(data);
		console.log(data.totalResults);
        return data.totalResults;
	}
	catch (error) {
		console.error("An error occured: ", error);
	};
};

let getDateByInterval = function(interval) {
    const now = new Date();
  
    if (interval == "today") {
        date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (interval == "last week") {
        date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (interval == "last month") {
        date = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }

    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    var year = date.getUTCFullYear();
    
    return year + "-" + month + "-" + day;
}

let initEventListeners = async function() {
    html_addKeyword.addEventListener('click', async function() {
        if (html_keywordInput.value != "") {
            keyword_request = html_keywordInput.value;
            keyword_dateInterval = html_keywordDate.value;
            keyword_date = getDateByInterval(keyword_dateInterval);
            url = `https://newsapi.org/v2/everything?q=${keyword_request}&from=${keyword_date}&apiKey=49017237d5bf4942a6fabc322f9e0ee7`;
            let total_results = await getByKeywordDate(url);
            console.log(total_results);

            html_keywords.innerHTML += 
            `<div class="c-keyword__item">
                <div class="c-keyword__header">
                    <span class="c-keyword__word">${keyword_request}</span>
                    <svg class="c-keyword__remove js-keyword-remove" xmlns="http://www.w3.org/2000/svg" width="54.447" height="54.449" viewBox="0 0 54.447 54.449">
                        <path id="Union_2" data-name="Union 2" d="M-6784.776-3744.169l-16.616,16.617L-6812-3738.16l16.617-16.616L-6812-3771.393l10.606-10.606,16.617,16.616L-6768.16-3782l10.606,10.608-16.616,16.617,16.616,16.616-10.606,10.608Z" transform="translate(6812 3782.001)" fill="#f7eafe"/>
                    </svg>
                </div>
                <span class="c-keyword__count">${total_results} articles</span>
                <span class="c-keyword__date">${keyword_dateInterval}</span>
            </div>`
        }
    });
};

document.addEventListener('DOMContentLoaded', function() {
    html_categories = document.querySelector('.js-categories');
    html_keywordInput = document.querySelector('.js-keyword-input');
    html_keywordDate = document.querySelector('.js-keyword-date')
    html_addKeyword = document.querySelector('.js-keyword-add');
    html_keywords = document.querySelector('.js-keywords');

    initEventListeners();
    
    getAPIs();
});
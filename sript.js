const srch = document.querySelector('#srch')
const btn = document.querySelector('#btn')
const txt = document.querySelector('.txt')
const recipeContainer = document.querySelector('.recipeContainer')
const recipeContainerBox = document.querySelector('.recipeContainerBox')
const recipeDetailContent = document.querySelector('.recipeDetailContent')
const recipeCloseBtn = document.querySelector('.recipeCloseBtn')


async function fetchRecipes(input) {
     txt.innerHTML = "<h3>Fetching Recipe...</h3>"
     
     const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
     const recipeData = await response.json();
     console.log(recipeData);
    
    txt.innerHTML="";
    recipeContainer.innerHTML = "";
    recipeContainerBox.style.backgroundImage = "none";
    recipeContainerBox.style.backgroundColor = "white";


    if (!recipeData.meals) {
        txt.innerHTML = "<h3>No recipes found!</h3>";
        return;
    }

    recipeData.meals.forEach(meal => {
    console.log(meal)

    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipeCls');

    recipeDiv.innerHTML=`
       <img src="${meal.strMealThumb}">
       <h3>${meal.strMeal} </h3>
       <p><span>${meal.strArea}</span> Dish</p>
       <p>${meal.strCategory}</p>
       `
       const button = document.createElement('button');
       button.textContent = "View Recipe";
       recipeDiv.appendChild(button);

       button.addEventListener('click', () => {
        openRecipePopup(meal);        //make this function in html code
       });

    recipeContainer.appendChild(recipeDiv); 
    });
}

function fetchIngredients(meal){
    let ingredientsList = '';
    for(let i=1; i<=20; i++){
        const ingredients = meal[`strIngredient${i}`];
        if(ingredients){
            const measure = meal[`strMeasure${i}`]
            ingredientsList+=`<li>${measure} ${ingredients}</li>`
        }
        else{
            break;
        }
    }
    return ingredientsList;
}

function openRecipePopup(meal){
    recipeDetailContent.innerHTML=`
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
      <div class="recipeInstruction">
        <h3>Instruction:</h3>
        <p>${meal.strInstructions}</p>
      </div>
    `
    recipeDetailContent.parentElement.style.display = "block";
}

recipeCloseBtn.addEventListener('click', () => {
    recipeDetailContent.parentElement.style.display = "none";
})

btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const searchInput = srch.value.trim();
    if(!searchInput){
        txt.innerHTML = "<h2>Type the meal in the search box..</h2>";
        return;
    }
    fetchRecipes(searchInput);
});


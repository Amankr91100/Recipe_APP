const srch = document.querySelector("#searchInput")
const btn = document.querySelector("#searchButton")
const txt = document.querySelector("#errorText")
const recipeContainer = document.querySelector("#recipeGrid")
const recipeContainerBox = document.querySelector("#resultsSection")
const recipeDetailContent = document.querySelector(".modal-content")
const recipeCloseBtn = document.querySelector("#modalClose")
const modalOverlay = document.querySelector("#modalOverlay")
const welcomeSection = document.querySelector("#welcomeSection")
const loadingSection = document.querySelector("#loadingSection")
const errorSection = document.querySelector("#errorSection")
const resultsSection = document.querySelector("#resultsSection")
const resultsTitle = document.querySelector("#resultsTitle")
const welcomeSearchInput = document.querySelector("#welcomeSearchInput")
const modalCloseButton = document.querySelector("#modalCloseButton")

async function fetchRecipes(input) {
  // Show loading state
  loadingSection.style.display = "flex"
  welcomeSection.style.display = "none"
  errorSection.style.display = "none"
  resultsSection.style.display = "none"

  // Update button state
  const buttonText = btn.querySelector(".search-button-text")
  const buttonLoading = btn.querySelector(".search-button-loading")
  buttonText.style.display = "none"
  buttonLoading.style.display = "inline"
  btn.disabled = true

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
    const recipeData = await response.json()
    console.log(recipeData)

    // Reset loading state
    loadingSection.style.display = "none"
    buttonText.style.display = "inline"
    buttonLoading.style.display = "none"
    btn.disabled = false

    recipeContainer.innerHTML = ""

    if (!recipeData.meals) {
      txt.textContent = "No recipes found. Try searching for something else!"
      errorSection.style.display = "block"
      return
    }

    // Show results
    resultsTitle.textContent = `Found ${recipeData.meals.length} delicious recipe${recipeData.meals.length !== 1 ? "s" : ""}`
    resultsSection.style.display = "block"

    recipeData.meals.forEach((meal, index) => {
      console.log(meal)

      const recipeDiv = document.createElement("div")
      recipeDiv.classList.add("recipe-card")
      recipeDiv.style.animationDelay = `${index * 0.1}s`

      recipeDiv.innerHTML = `
                <div class="recipe-image-container">
                    <img 
                        src="${meal.strMealThumb}" 
                        alt="${meal.strMeal}"
                        class="recipe-image"
                        loading="lazy"
                    >
                    <div class="recipe-overlay"></div>
                </div>
                <div class="recipe-content">
                    <h3 class="recipe-title">${meal.strMeal}</h3>
                    <div class="recipe-meta">
                        <div class="recipe-meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>${meal.strArea}</span>
                        </div>
                        <div class="recipe-meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                                <line x1="7" y1="7" x2="7.01" y2="7"/>
                            </svg>
                            <span>${meal.strCategory}</span>
                        </div>
                    </div>
                </div>
            `

      const button = document.createElement("button")
      button.textContent = "View Recipe"
      button.classList.add("recipe-button")
      recipeDiv.querySelector(".recipe-content").appendChild(button)

      button.addEventListener("click", () => {
        openRecipePopup(meal)
      })

      recipeContainer.appendChild(recipeDiv)
    })
  } catch (error) {
    // Reset loading state
    loadingSection.style.display = "none"
    buttonText.style.display = "inline"
    buttonLoading.style.display = "none"
    btn.disabled = false

    txt.textContent = "Failed to fetch recipes. Please try again."
    errorSection.style.display = "block"
  }
}

function fetchIngredients(meal) {
  let ingredientsList = ""
  for (let i = 1; i <= 20; i++) {
    const ingredients = meal[`strIngredient${i}`]
    if (ingredients && ingredients.trim()) {
      const measure = meal[`strMeasure${i}`] || ""
      ingredientsList += `
                <div class="ingredient-item">
                    <div class="ingredient-bullet"></div>
                    <span class="ingredient-text">
                        <span class="ingredient-measure">${measure.trim()}</span> ${ingredients.trim()}
                    </span>
                </div>
            `
    } else {
      break
    }
  }
  return ingredientsList
}

function openRecipePopup(meal) {
  const modalImage = document.querySelector("#modalImage")
  const modalTitle = document.querySelector("#modalTitle")
  const modalMeta = document.querySelector("#modalMeta")
  const ingredientsList = document.querySelector("#ingredientsList")
  const instructionsContent = document.querySelector("#instructionsContent")

  // Set modal content
  modalImage.src = meal.strMealThumb
  modalImage.alt = meal.strMeal
  modalTitle.textContent = meal.strMeal

  // Set meta information
  modalMeta.innerHTML = `
        <div class="recipe-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${meal.strArea} Cuisine</span>
        </div>
        <div class="recipe-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <span>${meal.strCategory}</span>
        </div>
    `

  // Set ingredients
  ingredientsList.innerHTML = fetchIngredients(meal)

  // Set instructions
  instructionsContent.textContent = meal.strInstructions

  // Show modal
  modalOverlay.style.display = "flex"
  document.body.style.overflow = "hidden"
}

// Close modal event listeners
recipeCloseBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none"
  document.body.style.overflow = "unset"
})

modalCloseButton.addEventListener("click", () => {
  modalOverlay.style.display = "none"
  document.body.style.overflow = "unset"
})

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = "none"
    document.body.style.overflow = "unset"
  }
})

// Search form submission
btn.addEventListener("click", (e) => {
  e.preventDefault()
  const searchInput = srch.value.trim()
  if (!searchInput) {
    txt.textContent = "Type the meal in the search box.."
    errorSection.style.display = "block"
    welcomeSection.style.display = "none"
    return
  }
  fetchRecipes(searchInput)
})

// Welcome search input
welcomeSearchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const searchInput = welcomeSearchInput.value.trim()
    if (searchInput) {
      srch.value = searchInput
      fetchRecipes(searchInput)
    }
  }
})

// Keyboard events
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.style.display === "flex") {
    modalOverlay.style.display = "none"
    document.body.style.overflow = "unset"
  }
})



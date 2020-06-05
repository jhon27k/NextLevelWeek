populateUfs();

function populateUfs(params) {
  const ufSelect = document.querySelector("select[name=uf]");
  axios
    .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then((response) => {
      // console.log(response);
      return response.data;
    })
    .then((response) => {
      // console.log(response);
      for (state of response) {
        ufSelect.innerHTML += `<option value="${state.id}"> ${state.nome} </option>`;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getCities(event) {
  const id = event.target.value;
  const citiesSelect = document.querySelector("select[name=city]");
  const stateInput = document.querySelector("input[name=state]");
  const indexOfSelectedState = event.target.selectedIndex;
  stateInput.value = event.target.options[indexOfSelectedState].text;
  citiesSelect.innerHTML = `<option value="0">Selecione a cidade</option>`;
  citiesSelect.disabled = true;
  if (id === "0") {
    citiesSelect.disabled = true;
    return;
  }
  axios
    .get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${id}/municipios`
    )
    .then((response) => {
      return response.data;
    })
    .then((response) => {
      for (city of response) {
        citiesSelect.innerHTML += `<option value="${city.nome}"> ${city.nome} </option>`;
      }
      citiesSelect.disabled = false;
    })
    .catch((err) => {
      console.log(err);
    });
}

document.querySelector("select[name=uf]").addEventListener("change", getCities);

//pegar todos os li
const itemsToCollect = document.querySelectorAll(".items-grid li");

for (const item of itemsToCollect) {
  item.addEventListener("click", handleSelectedItem);
}

const collectedItems = document.querySelector("input[name=items]");

let selectedItems = [];

function handleSelectedItem(event) {
  const itemSelected = selectedItems;
  //add or remove class
  const itemLi = event.target;
  const itemId = event.target.dataset.id;

  itemLi.classList.toggle("selected");

  //verificar se existe itens selecionados
  const alreadySelected = selectedItems.findIndex((item) => {
    const itemFound = item == itemId;
    return itemFound;
  });

  if (alreadySelected >= 0) {
    const filteredItems = selectedItems.filter((item) => {
      const itemIsDifferent = item != itemId;
      return itemIsDifferent;
    });

    selectedItems = filteredItems;
  } else {
    //adicionar elemento no array
    selectedItems.push(itemId);
  }

  collectedItems.value = selectedItems;
}

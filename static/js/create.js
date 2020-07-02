const body = document.getElementById('editor_holder');
var schemas;
var dropdown;


// Load a/the schema/s when page is loaded or on change
async function getSchemas(endpoint=`?query=type:"Schema"`) {
  var res = await getData(`/objects${endpoint}`);
  var resJSON = await res.json();
  console.log('GETSCHEMAS');
  console.log(resJSON);
  return resJSON;
}


// Check whether the url contains a schema type on load or change
function getParamId() {
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var identifier = urlParams.get('identifier')
  console.log('IDENTIFIER');
  console.log(identifier);
  return identifier
}

function createDropdown() {
  dropdown = document.createElement('select');
  dropdown.id = 'schemasList';
  dropdown.onchange = updatePage;
  body.appendChild(dropdown);

  for (i=0; i<schemas.length; i++) {
    var option = document.createElement("option");
    option.id = schemas[i].content.identifier;
    option.text = schemas[i].content.name;
    dropdown.add(option);
  }
}


function createForm(schema) {
  formOptions = {
    schema: schema,
    theme: 'bootstrap4',
    show_errors: "change",
    display_required_only: false
  }

  const editor = new JSONEditor(body, formOptions);
}

// Run the functions on load or change
async function run() {
  let identifier = getParamId();

  if (identifier) {
    schema = await getSchemas(`${identifier}`);
    createForm(schema.schema);
  } else {
    schemas = await getSchemas();
    schemas = schemas.results;
    createDropdown();
  }
}

function updatePage() {
  let identifier = dropdown.options[dropdown.selectedIndex].id;
  window.location.search = `?identifier=/${identifier}`;
  run()
}



window.onload = run;

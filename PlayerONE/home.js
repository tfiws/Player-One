document.querySelector('.search-form').addEventListener('submit',function(e){
    e.preventDefault(); //prevents form submitting and refreshing page
    const searchTerm = this.querySelector('input').value;

    if(searchTerm.trim()){
        console.log("Searching for:"+searchTerm);
        alert('Searching for:'+searchTerm);
        }
    }
)
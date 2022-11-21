function search(){
    var cityInput = document.getElementById("cityInput").value;
    if(cityInput=="")
    {
        return;
    }
    else{
        var savedCity = localStorage.getItem(cityInput);
        if(savedCity ==null)
        {
            localStorage.setItem('city',cityInput);
            document.getElementById("savedC").innerHTML=cityInput;
        }
        else{
            document.getElementById("savedC").innerHTML=cityInput;
        }

    }
    
}
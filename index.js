function dersEkle(ders, kredi, not, index){
    var markup = '<tr>'
        + '<th scope="row">'+ index +'</th>'
        + '<td class="col-md-5 paddingLeftZero">'
        + '<input type="text" class="plainTextInput" name="ders" value="'+ ders +'"/></td>'
        + '<td class="col-md-2 paddingLeftZero">'
        + '<input type="number" class="plainTextInput" name="kredi" min="0" value="'+ kredi +'"/></td>'
        + '<td class="col-md-2 paddingLeftZero">'
        + '<input type="number" class="plainTextInput" name="not" min="0" max="4" step="0.5" value="'+ not +'"/></td>'
        + '<td class="paddingLeftZero">'
        + '<button type="button" class="close" aria-label="Close">'
        + '<span aria-hidden="true">&times;</span>'
        + '</button>'
        + '</td>'
        + '</tr>';
    $("table tbody").append(markup);
}

function indexHesapla(){
    if($("tbody > tr:last-child > th").text()){
        return parseInt($("tbody > tr:last-child > th").text()) + 1;
    }
    else{
        return 1;
    }
}

function agnoHesapla(){
    var agno = 0;
    var kredi = 0;
    var row = $("#inputTr");
    while(row.next().html()){
        row = row.next();
        kredi += parseFloat(row.find("[name=kredi]").val());
        agno += parseFloat(row.find("[name=kredi]").val()) * parseFloat(row.find("[name=not]").val());
    }
    agno /= kredi;
    if(agno){
        $("#agno").text(agno.toFixed(2));
    }
    else{
        $("#agno").text("");
    }
}

function inputlariBosalt(){
    $("#inputTr").find("input").val("");
}

function localeKaydet(key, value){
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(key, value);
    }
}

function localdenSil(key){
    if (typeof(Storage) !== "undefined") {
        localStorage.removeItem(key);
    }
}

$(document).ready(function(){
    var ders, kredi, not, index = 1;
    while(localStorage.getItem("ders" + index)){
        dersEkle(localStorage.getItem("ders" + index)
                 , localStorage.getItem("kredi" + index)
                 , localStorage.getItem("not" + index), index);
        index++;
    }
    agnoHesapla();

    $(".plusBtn").click(function(){
        index = indexHesapla();
        ders = $("[name=ders]").val();
        kredi = $("[name=kredi]").val();
        not = $("[name=not]").val();
        dersEkle(ders, kredi, not, index);
        agnoHesapla();
        inputlariBosalt();
        localeKaydet("ders" + index, ders);
        localeKaydet("kredi" + index, kredi);
        localeKaydet("not" + index, not);
    });

    $("tbody").on("click", ".close", function(){
        var newIndex;
        $(this).parents("tr").nextAll().children("th").text(function() {
            newIndex = parseInt($(this).text()) - 1;
            return newIndex;
        });
        $(this).parents("tr").remove();
        // localdenSil("ders");
        // localdenSil("kredi");
        // localdenSil("not");
        agnoHesapla();
    });

    $("tbody").on("blur", ".plainTextInput",function(){
        //localeKaydet();
        agnoHesapla();
    });
});

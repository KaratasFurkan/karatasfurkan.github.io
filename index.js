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

function localeSatirKaydet(index, value1, value2, value3){
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("ders" + index, value1);
        localStorage.setItem("kredi" + index, value2);
        localStorage.setItem("not" + index, value3);
    }
}

function localdenSil(key){
    if (typeof(Storage) !== "undefined") {
        localStorage.removeItem(key);
    }
}

function localdenSatirSil(index){
    if (typeof(Storage) !== "undefined") {
        localStorage.removeItem("ders" + index);
        localStorage.removeItem("kredi" + index);
        localStorage.removeItem("not" + index);
    }
}

function localVerileriGetir(){
    var index = 1;
    while(localStorage.getItem("ders" + index)){
        dersEkle(localStorage.getItem("ders" + index)
                 , localStorage.getItem("kredi" + index)
                 , localStorage.getItem("not" + index), index);
        index++;
    }
}

$(document).ready(function(){
    var ders, kredi, not, index;
    localVerileriGetir();
    agnoHesapla();

    $(".plusBtn").click(function(){
        index = indexHesapla();
        ders = $("[name=ders]").val();
        kredi = $("[name=kredi]").val();
        not = $("[name=not]").val();
        dersEkle(ders, kredi, not, index);
        agnoHesapla();
        inputlariBosalt();
        localeSatirKaydet(index, ders, kredi, not);
    });

    $("tbody").on("click", ".close", function(){
        var newIndex;
        $(this).parents("tr").nextAll().children("th").text(function() {
            newIndex = parseInt($(this).text()) - 1;
            ders = $(this).next().children("[name=ders]").val();
            kredi = $(this).nextAll().children("[name=kredi]").val();
            not = $(this).nextAll().children("[name=not]").val();
            localeSatirKaydet(newIndex, ders, kredi, not);
            return newIndex;
        });
        $(this).parents("tr").remove();
        localdenSatirSil(newIndex + 1);
        agnoHesapla();
    });

    $("tbody").on("blur", ".plainTextInput",function(){
        var key, value;
        key = $(this).attr("name");
        index = $(this).parent().siblings("th").text();
        value = $(this).val();
        localeKaydet(key + index, value);
        agnoHesapla();
    });
});

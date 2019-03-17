function dersEkle(index, ders, kredi, not){
    var markup = '<tr>'
        + '<th scope="row" class="pdLeftRightZero">' + index + '</th>'
        + '<td class="col-md-5 paddingLeftZero">'
        + '<input type="text" class="plainTextInput" name="ders" value="'+ ders +'"/></td>'
        + '<td class="col-md-2 paddingLeftZero">'
        + '<input type="number" class="plainTextInput" name="kredi" min="0" value="'+ kredi +'"/></td>'
        + '<td class="col-md-2 paddingLeftZero">'
        + '<input type="number" class="plainTextInput" name="not" min="0" max="4" step="0.5" value="'+ not +'"/></td>'
        + '<td class="paddingLeftZero pdLeftRightZero">'
        + '<button type="button" class="close pdLeftRightZero" aria-label="Close">'
        + '<span aria-hidden="true">&times;</span>'
        + '</button>'
        + '</td>'
        + '</tr>';
    $("#inputTr").after(markup);
}

function getLength(){
    var length;
    if((length = $("tbody > tr:last-child > th").text())){ //assignment
        return parseInt(length);
    }
    else{
        return 0;
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

function areInputsEmpty(){
    var empty = false;
    $(".form-control").each(function(){
        if($.trim($(this).val()) == ""){
            empty = true;
        }
    });
    return empty;
}

function disableTheButton(){
    $(".plusBtn").prop("disabled", true).addClass("disabled");
}

function enableTheButton(){
    $(".plusBtn").prop("disabled", false).removeClass("disabled");
}

function localeKaydet(length){
    if (typeof(Storage) !== "undefined") {
        var i, ders, kredi, not;
        for(i = 1; i <= length; i++){
            ders = $("tbody tr").eq(i).find("[name=ders]").val();
            kredi = $("tbody tr").eq(i).find("[name=kredi]").val();
            not = $("tbody tr").eq(i).find("[name=not]").val();
            localStorage.setItem("ders" + i, ders);
            localStorage.setItem("kredi" + i, kredi);
            localStorage.setItem("not" + i, not);
        }
        localStorage.setItem("length", length);
    }
}

function localdenSil(index){
    if (typeof(Storage) !== "undefined") {
        localStorage.removeItem("ders" + index);
        localStorage.removeItem("kredi" + index);
        localStorage.removeItem("not" + index);
    }
}

function localVerileriGetir(length){
    for(var i = length; i >= 1; i--){
        dersEkle(i, localStorage.getItem("ders" + i),
                 localStorage.getItem("kredi" + i),
                 localStorage.getItem("not" + i));
    }
}

//--------------------------------------------------------------------------//
$(document).ready(function(){
    var ders, kredi, not;
    localVerileriGetir(localStorage.getItem("length"));
    agnoHesapla();
    $(".form-control").eq(0).focus();

    //----------- Input kutuları -----------//
    $(".form-control").eq(0)
        .on("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                $(".form-control").eq(1).focus();
            }
        })
        .on("keyup", function() {
            if(areInputsEmpty()){
                disableTheButton();
            }
            else{
                enableTheButton();
            }
        });


    $(".form-control").eq(1)
        .on("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                $(".form-control").eq(2).focus();
            }
        })
        .on("keyup", function() {
            if(areInputsEmpty()){
                disableTheButton();
            }
            else{
                enableTheButton();
            }
        });

    $(".form-control").eq(2)
        .on("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                if(!$(".plusBtn").prop("disabled")){
                    $(".plusBtn").click();
                }
                $(".form-control").eq(0).focus();
            }
        })
        .on("keyup", function() {
            if(areInputsEmpty()){
                disableTheButton();
            }
            else{
                enableTheButton();
            }
        });

    $(".plainTextInput")
        .on("keydown", function(event) {
            if (event.key === "Enter") {
                agnoHesapla();
            }
        })
        .on("keyup", function() {
            if($(this).val() == ""){
                $(this).attr("placeholder", "Doldurun.")
                    .parent().addClass("danger");
            }
            else{
                $(this).parent().removeClass("danger");
            }
        });
    //--------------------------------------//

    $(".plusBtn").click(function(){
        ders = $("[name=ders]").val();
        kredi = $("[name=kredi]").val();
        not = $("[name=not]").val();
        dersEkle(1, ders, kredi, not);

        $("tbody tr").eq(1).nextAll().children("th").text(function() {
            return parseInt($(this).text()) + 1;
        });

        agnoHesapla();
        inputlariBosalt();
        disableTheButton();
    });

    $("tbody").on("click", ".close", function(){
        $(this).parents("tr").nextAll().children("th").text(function() {
            return parseInt($(this).text()) - 1;
        });

        localdenSil($("tr").last().index());
        $(this).parents("tr").remove();
        agnoHesapla();
    });

    $("tbody").on("blur", ".plainTextInput", function(){
        agnoHesapla();
    });
});

$(window).bind('beforeunload', function(){
    localeKaydet(getLength());
});

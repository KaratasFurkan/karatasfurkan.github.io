function dersEkle(index, ders, kredi, not = ""){
    var markup = '<tr>'
        + '<th scope="row" class="pdLeftRightZero">' + index + '</th>'
        + '<td class="col-md-5 paddingLeftZero">'
        + '<input type="text" class="plainTextInput" placeholder="?" name="ders" value="'+ ders +'"/></td>'
        + '<td class="col-md-2 paddingLeftZero">'
        + '<input type="number" class="plainTextInput" placeholder="?" name="kredi" min="0" value="'+ kredi +'"/></td>'
        + '<td class="col-md-2 paddingLeftZero">'
        + '<input type="number" class="plainTextInput" placeholder="?" name="not" min="0" max="4" step="0.5" value="'+ not +'"/></td>'
        + '<td class="paddingLeftZero pdLeftRightZero">'
        + '<button type="button" class="close pdLeftRightZero" aria-label="Close">'
        + '<span aria-hidden="true">&times;</span>'
        + '</button>'
        + '</td>'
        + '</tr>';
    $("#inputTr").after(markup);
}

function egitimPlaniEkle(){
    var index, length = getLength();

    $.get("https://raw.githubusercontent.com/KaratasFurkan/karatasfurkan.github.io/master/E%C4%9Fitim%20Planlar%C4%B1/YtuCe.txt", function(data){
        data = data.split("\n");
        data.reverse();
        index = data.length - 24;
        data.forEach(function(item){
            item = item.split(",");
            if(item[0].includes(".Yıl")){
                $("#inputTr").after("<tr><th>-</th>"
                                    + "<td class='paddingLeftZero' colspan='4'><span class='donem'>"
                                    + item +  "</span></td></tr>");
            }
            else if (item[0] == ""){
            }
            else{
                dersEkle(index--, item[0], item[1]);
                //$("tbody tr").eq(1).find("[name=not]").parents("tr").addClass("warning");
            }
        });

        length = (getLength() - 8) - length; //egitim plani uzunluğu

        $("tbody tr").eq(length + 8).nextAll().children("th").text(function() {
            return length++ + 1;
        });
    });
}

function getLength(){
    var length;
    if((length = $("tr").last().index())){ //assignment
        return parseInt(length);
    }
    else{
        return 0;
    }
}

function agnoHesapla(){
    var agno = 0, kredi = 0, tempKredi = 0, tempNot = 0;
    var row = $("#inputTr");
    while(row.next().html()){
        row = row.next();
        tempKredi = parseFloat(row.find("[name=kredi]").val());
        tempNot = parseFloat(row.find("[name=not]").val());
        if(!isNaN(tempKredi) && !isNaN(tempNot)){
            kredi += tempKredi;
            agno += tempKredi * tempNot;
        }
    }
    agno /= kredi;
    if(agno){
        $("#agno").text(agno.toFixed(2));
        $("#kredi").text("Kredi: " + kredi);
    }
    else{
        $("#agno").text("");
        $("#kredi").text("");
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
            if (ders === undefined){
                localStorage.setItem("ders" + i, $("tbody tr").eq(i).find("span").text());
                localStorage.setItem("egitimPlani", 1);
            }else {
                localStorage.setItem("ders" + i, ders);
                localStorage.setItem("kredi" + i, kredi);
                localStorage.setItem("not" + i, not);
            }
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
    var donem;

    if (localStorage.getItem("egitimPlani") == 1){
        donem = 8;
    }else {
        donem = 0;
    }

    for(var i = length; i >= 1; i--){
        if(localStorage.getItem("ders" + i).includes(".Yıl")){
            $("#inputTr").after("<tr><th>-</th>"
                                + "<td class='paddingLeftZero'><span class='donem'>"
                                + localStorage.getItem("ders" + i)
                                +  "</span></td><td></td><td></td><td></td></tr>");
            donem--;
        }else {
            dersEkle(i - donem, localStorage.getItem("ders" + i),
                     localStorage.getItem("kredi" + i),
                     localStorage.getItem("not" + i));
        }
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
        .on("input", function() {
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
        .on("input", function() {
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
        .on("input", function() {
            if(areInputsEmpty()){
                disableTheButton();
            }
            else{
                enableTheButton();
            }
        });

    $("tbody").on("input", ".plainTextInput", function() {
        agnoHesapla();
        // if($(this).val() == ""){
        //     $(this).parents("tr").addClass("warning");
        // }
        // else{
        //     $(this).parents("tr").removeClass("warning");
        // }
    });
    //--------------------------------------//

    $(".plusBtn").click(function(){
        ders = $("[name=ders]").val();
        kredi = $("[name=kredi]").val();
        not = $("[name=not]").val();
        dersEkle(1, ders, kredi, not);

        $("tbody tr").eq(1).nextAll().children("th").text(function() {
            return parseInt($(this).text()) ? parseInt($(this).text()) + 1 : "-";
        });

        agnoHesapla();
        inputlariBosalt();
        disableTheButton();
    });

    $("tbody").on("click", ".close", function(){
        $(this).parents("tr").nextAll().children("th").text(function() {
            return parseInt($(this).text()) ? parseInt($(this).text()) - 1 : "-";
        });

        localdenSil($("tr").last().index());
        $(this).parents("tr").remove();
        agnoHesapla();
    });

    // Get the modals
    var delAllModal = document.getElementById("delAll-modal");
    var addProgramModal = document.getElementById("addProgram-modal");

    // Get the button that opens the modal
    var delAllBtn = document.getElementById("delAll");
    var addProgramBtn = document.getElementById("addProgram");

    // When the user clicks on the buttons, open the modals
    delAllBtn.onclick = function() {
        delAllModal.style.display = "block";
    };

    addProgramBtn.onclick = function() {
        addProgramModal.style.display = "block";
    };

    // When the user clicks cancel, close the modal
    $(".vazgec").on("click", function(){
        delAllModal.style.display = "none";
        addProgramModal.style.display = "none";
    });

    // Delete all
    $("#sil").on("click", function(){
        $("#inputTr").nextAll().remove();
        delAllModal.style.display = "none";
        agnoHesapla();
        localStorage.clear();
    });

    // Add program
    $("#ytu").click(function(){
        egitimPlaniEkle();
        addProgramModal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == delAllModal || event.target == addProgramModal) {
            delAllModal.style.display = "none";
            addProgramModal.style.display = "none";
        }
    };
});

$(window).bind('beforeunload', function(){
    localeKaydet(getLength());
});

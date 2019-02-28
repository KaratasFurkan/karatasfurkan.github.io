function agnoHesapla(){
    $("#agno").text("3.2");
}

$(document).ready(function(){
    $(".plusBtn").click(function(){
        var ders = $("[name=ders]").val();
        var kredi = $("[name=kredi]").val();
        var not = $("[name=not]").val();
        var index = parseInt($("tbody > tr:last-child > th").text()) + 1;
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
        agnoHesapla();
    });

    $("tbody").on("click", ".close", function(){
        $(this).parents("tr").remove();
        agnoHesapla();
        $()
    });
});

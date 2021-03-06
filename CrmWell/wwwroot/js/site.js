﻿var titulo = $("#title");
//OBJECTS
var Usuario = {
    Novo: null,
    Editando: null,
    id: null,
    Nome: null,
    Login: null,
    Senha: null,
    Email: null,
    Cpf: null,
    NivelUsuario: 0
}
var Cliente = {
    Novo: null,
    Editando: null,
    id: null,
    Nome: null,
    Sobrenome: null,
    Email: null,
    Cpf: null
}
var Produto = {
    Novo: null,
    Editando: null,
    Id: null,
    Codigo: null,
    Nome: null,
    propriedades: []

}
var ProdutoPropriedades = {
    Tamanho: null,
    Preco: null,
    Unidades: null,
    DatadeModificacao: ''

}
var Resultado = {
    resultado: null,
    erro: null
}
var Venda = {
    Id: null,
    ClienteID: null,
    DataDaVenda: '',
    ValorTotal: '',
    ListProduto: []
}
const Meses = {
    0: 'Janeiro',
    1: 'Fevereiro',
    2: 'Março',
    3: 'Abril',
    4: 'Maio',
    5: 'Junho',
    6: 'Julho',
    7: 'Agosto',
    8: 'Setembro',
    9: 'Outubro',
    10: 'Novembro',
    11: 'Dezembro'
};
const TipoGrafico = {
    BAR: 'bar',
    LINE: 'line',
    PIE: 'pie'
}
function Chartclass() {
    return {
        Labels: null,
        Values: null,
        Tipo: TipoGrafico.BAR
    }
};
//FIM OBJECTS
$(document).ready(async () => {

    if ($("#title").html() != undefined)
        if (titulo.text() === "")
            titulo.text(GetPage());
    await $("#menucont >div >p[id='construcao']").parent().each(async (d, c) => {
        await $(c).addClass('emconstrucao');
    });
});
//FUNCOES
function GetController() {
    return window.location.href.split(window.location.host)[1].split("/")[1];
}
function GetPage() {
    return window.location.href.split(window.location.host)[1].split("/")[2];
}
function MudaUrl(controller, action) {
    if (controller == null)
        controller = GetController();
    let href = "https://" + window.location.host + "/" + controller + "/" + action;
    window.location.href = href;
}

$(document).on("click", "#Logout", () => {

    $.post("/Login/Logout", (data) => {

        if (data)
            window.location.reload();
    });

});

//Funcoes de grid
function EscondeElemento(elemento) {
    $(elemento).fadeOut('slow');
    $(elemento).prop("hidden", true);
}
function AparecerElemento(elemento) {
    $(elemento).fadeIn('slow');
    $(elemento).prop("hidden", false);

}
function Adicionar(Teladeadicionar, Teladelistagem) {
    EscondeElemento(Teladelistagem);
    EscondeElemento("#btnNovo");
    EscondeElemento("#btnDeletar");
    EscondeElemento("#btnEditar");
    AparecerElemento("#btnCancelar");
    AparecerElemento("#btnSalvar");
    AparecerElemento(Teladeadicionar);

}
function Cancelar(Teladeadicionar, Teladelistagem) {


    LimpaFormulario(Teladeadicionar);
    AparecerElemento(Teladelistagem);
    AparecerElemento("#btnNovo");
    AparecerElemento("#btnDeletar");
    AparecerElemento("#btnEditar");
    EscondeElemento("#btnCancelar");
    EscondeElemento("#btnSalvar");
    EscondeElemento(Teladeadicionar);


}


function LimpaFormulario(TeladoForm) {
    let c = TeladoForm + " form ";
    $(c)[0].reset();
    $(c).removeClass("border-danger");
    //$(c).toArray().forEach(o => o.value = null);
}

// Checa se um array tem nulos
function checarNulos(array, arrayOpcionalDeExcessoes) {
    let naoTemNulo = true;
    //Caso tiver um array de excessões:
    if (arrayOpcionalDeExcessoes !== undefined) {
        if (typeof arrayOpcionalDeExcessoes[0] == "number") {

            for (let c in array) {
                $("input[name =\'" + array[c].name + "\' ]").removeClass("erroNoInput");
                for (let itemInterno in arrayOpcionalDeExcessoes) {
                    if (c == arrayOpcionalDeExcessoes[itemInterno].toString()) {
                        $("input[name =\'" + array[c].name + "\' ]").removeClass("erroNoInput");

                        break;
                    } else if ((array[c].value == null || array[c].value == "") && $("input[name =\'" + array[c].name + "\' ]")[0].name != "__RequestVerificationToken") {
                        $("input[name =\'" + array[c].name + "\' ]").addClass("erroNoInput");
                        naoTemNulo = false;
                    }
                }
            }

        }

    } else { //Caso não tiver
        for (let c in array) {
            $("input[name =\'" + array[c].name + "\' ]").removeClass("erroNoInput");
            if ((array[c].value == null || array[c].value == "") && $("input[name =\'" + array[c].name + "\' ]")[0].name != "__RequestVerificationToken") {
                $("input[name =\'" + array[c].name + "\' ]").addClass("erroNoInput");
                naoTemNulo = false;
            }


            if (!naoTemNulo) {
                toastr.options.preventDuplicates = true;
                toastr.error("Preencha os Campos", "Ops!", { timeOut: 2000 });
            }
        }
    }


    return naoTemNulo;
}
////
////

async function Tabela(idtabela, action, controller) {
    //Exemplo de coluna
    //{ "data": "Nome", "title": "Nome", "autowidth": true }
    if (controller == null)
        controller = GetController();
    let colunas = TableGetColuns(idtabela);
    let table = await $('#' + idtabela).DataTable({
        language: {
            "lengthMenu": "Exibe _MENU_ Registros por página",
            "search": "Procurar",
            "paginate": { "previous": "Retorna", "next": "Avança" },
            "zeroRecords": "Nada foi encontrado",
            "info": "Exibindo página _PAGE_ de _PAGES_",
            "infoEmpty": "Sem registros",
            "infoFiltered": "(filtrado de _MAX_ regitros totais)"
        },
        //"processing": true,
        //"serverSide": true,
        //"filter": true, // habilita o filtro(search box)
        //"lengthMenu": [[3, 5, 10, 25, 50, -1], [3, 5, 10, 25, 50, "Todos"]],
        pageLength: 10,
        destroy: true,
        responsive: true,
        ajax: {
            url: "/" + controller + "/" + action,
            type: "POST",
            datatype: "json",
            cache: true,
            complete: function (e) {
                ImprimirNoConsole(e.responseText, "default");
            }
        },
        columns: colunas
    });
    //$('.dataTables_length').addClass('bs-select');

    return table;
}

//function RowValueGet(objeto, table,linha) {
//        if ($(row).hasClass('selected')) {
//            $(row).removeClass('selected');
//            objeto = objeto;
//        }
//        else {
//            table.$('tr.selected').removeClass('selected');
//            $(row).addClass('selected');
//            let t = tabela.row(row).data();
//            objeto = t;
//        }
//    console.log(objeto);
//    return objeto;
//    };


function TableGetColuns(idtabela) {
    let tab = $("#" + idtabela + "> thead > tr > th");
    let colunas = [];
    for (let i = 0; i < tab.length; i++) {
        colunas.push({ "data": tab[i].attributes.name.value, "title": tab[i].innerText != "" ? tab[i].innerText : tab[i].attributes.name.value, "autowidth": true });
    }
    return colunas;
}
function ValorInput(obj, form) {
    form = $("#" + form).serializeArray();
    let objarray = []
    objarray = Object.values(obj);

    for (var i = 0; i < form.length; i++) {

        if ($("input[name =\'" + form[i].name + "\' ]").length > 1) {
            for (let b = 0; b < $("input[name =\'" + form[i].name + "\' ]").length; b++) {
                debugger
                if ($($("input[name =\'" + form[i].name + "\' ]")[b]).val() == objarray[i]) {
                    $($("input[name =\'" + form[i].name + "\' ]")[b]).prop('checked', 'checked');
                }
            }

        }
        else {
            $("input[name =\'" + form[i].name + "\' ]").val(objarray[i]);
        }
    }


}
function BloquearTela() {
    $("#loaderpage").css("display", "block");
}
function DesbloquearTela() {
    $("#loaderpage").css("display", "none");

}

function SerialiazaGrupoForm(grupoform) {
    let formserialized = [];
    for (let i = 0; i <= grupoform.length; i++) {
        let grupoatual = grupoform[i];
        formserialized.push($(grupoatual).serializeArray());
    }
    return formserialized;
}
function ResetaGrupoFormulario(grupoform) {
    for (let i = 0; i < grupoform.length; i++) {
        $(grupoform)[i].reset();

    }
}
function ImprimirNoConsole(msg, tipo = "error") {
    switch (tipo) {
        case "error":
            console.error("❌ ERRO NO C#: " + msg);
            break;
        case "warn":
            console.warn("⚠️ Ops: " + msg);
            break;
        case "default":
            console.log("✌️ Console: " + msg);
            break;

        default:
    }
}

function validar(seletor, arrayMensagemErro) {

    var seletor = $('#' + seletor);
    if (!seletor.parsley().isValid()) {
        seletor.addClass("erroNoInput2");
        toastr.error(arrayMensagemErro[0], arrayMensagemErro[1]);
        return true;
    } else {
        seletor.removeClass("erroNoInput2");
    }
}
function ResetarObjeto(obj) {
    let objarray = Object.entries(obj);
    let newobj = {};
    for (let i = 0; i < objarray.length; i++) {
        objarray[i][1] = null;
        newobj[objarray[i][0]] = objarray[i][1];
    }
    //= JSON.stringify(Object.assign({}, objarray));
    return newobj;


}
function ObjetoENulo(obj) {
    var state = true;
    for (let key in obj) {
        if (!(obj[key] === null || obj[key] === "")) {
            state = false;
            break;
        }
    }
    return state;
}
function CopiaEntidade(obj) {
    let o = $.extend(true, {}, obj);
    return o;
}
async function ExecutaAjax(metodo, dados) {
    let resultado;
    await $.post('/' + GetController() + "/" + metodo, dados, (result) => { resultado = result; });
    return resultado;
}


// Função que tira espaço do input.
// 1-- O primeiro parâmetro é o id do form
// 2-- O segundo parâmetro é se vai tirar todos os espaços ou só espaço no começo (trye ou false)
// Obs.: Mateus seu preguiçoso, melhora essa função dps para ela permitir inputs de exceção.

function tiraEspacoDosInputs(idDoForm, todosEspacos) {
    if (todosEspacos) {
        $("form#" + idDoForm + " :input").each(function () {
            var input = $(this);
            input.bind('input', function () {
                input[0].value = input[0].value.trim();
            });
        });
    } else {
        $("form#" + idDoForm + " :input").each(function () {
            var input = $(this);
            input.bind('input', function () {
                input[0].value = input[0].value.trimLeft();
            });
        });
    }
}
function ValidaSeletores(campos) {
    let camposvazios = getCamposVazios(campos);
    for (let i = 0; i < camposvazios.length; i++) {
        if (camposvazios[i].tagName == "SELECT" && i == 0) {
            debugger
            $(camposvazios[i]).select2('open');
            $("#" + camposvazios[i].id).next().addClass('border-error');
        }
        else if (camposvazios[i].tagName != "BUTTON" && camposvazios[i].tagName == "INPUT") {
            $(camposvazios[i]).addClass('border-error');
        }
    }
    debugger
    if (camposvazios.length == 0)
        return true
    else {
        toastr.error("Por favor, Preencha os Campos", titulo.text(), { preventDuplicates: true, timeOut: 2500, progressBar: true });
        return false
    }
}
function getCamposVazios(campos) {

    let camposvazios = [];
    for (let i = 0; i < campos.length; i++) {
        if (campos[i].value == '' && campos[i].tagName != "BUTTON") {
            camposvazios.push(campos[i]);

        }
    }
    return camposvazios;
}
//MONETARIO+++++++++++++++++++++++++++++++++++++++++++++++++++++
function ConverteDinheiroToNumber(dinheiro) {
    let cifra = dinheiro.split(':').length >= 2;
    let milhar = cifra ? dinheiro.substr(3).split('.').length >= 2 : dinheiro.split('.').length >= 2;
    let dinheironum;
    if (cifra)
        dinheironum = milhar ? Number((dinheiro.substr(3).replace(',', '.').replace('.', '')).replace(/[^0-9\.-]+/g, "")) : Number((dinheiro.substr(3).replace(',', '.')).replace(/[^0-9\.-]+/g, ""));
    else
        dinheironum = milhar ? Number((dinheiro.replace(',', '.').replace('.', '')).replace(/[^0-9\.-]+/g, "")) : Number((dinheiro.replace(',', '.')).replace(/[^0-9\.-]+/g, ""));
    return dinheironum;
}
function ConverteNumEmDinheiro(dinheiroNum, comcifrao = false) {
    let casas = (Number(dinheiroNum.toString().replace(/[^0-9\.-]+/g, ""))).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    let subcasas = casas.substr(casas.length - (casas.length + 3)).replace('.', ',');
    let dinheiroformated = !comcifrao ? casas.substr(0, casas.length - 3).replace(',', '.') + subcasas : "R$:" + casas.substr(0, casas.length - 3).replace(',', '.') + subcasas;
    return dinheiroformated;
}
function GetMesesEntre(mes = [2]) {
    let lista = [];
    for (let i = mes[0]; i <= mes[1]; i++) {
        lista.push(Meses[i]);
    }
    return lista;
}
//
//CHART.JS
//
let mychart = null;
function GerarGraficoAnual(idchart, tipo, labels = [], label, data = [], labelstring) {
    let ctx = document.getElementById(idchart).getContext('2d');
    let config = {
        type: tipo,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(58, 189, 141,0.5)',
                    'rgba(186, 135, 67,0.5)',
                    'rgba(22, 145, 245,0.5)',
                    'rgba(227, 105, 255,0.5)',
                    'rgba(182,224,43,0.5)',
                    'rgba(91, 3, 158,0.5)',
                    'rgba(9, 142, 144,0.5)',
                    'rgba(210, 29, 132, 0.5)',
                    'rgba(154, 22, 25, 0.5)',
                    'rgba(25, 26, 82, 0.5)',
                    'rgba(125, 179, 196, 0.5)',
                    'rgba(233, 130, 100, 0.5)',
                    'rgba(200, 10, 4, 0.5)',
                    'rgba(158, 19, 131,0.5)',
                    'rgba(186, 15, 255,0.5)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(58, 189, 141,1)',
                    'rgba(186, 135, 67,1)',
                    'rgba(22, 145, 245,1)',
                    'rgba(215, 38, 255,1)',
                    'rgba(182,224, 43,1)',
                    'rgba(91, 3, 158,1)',
                    'rgb(9, 142, 144)',
                    'rgba(210, 29, 132, 1)',
                    'rgba(154, 22, 25, 1)',
                    'rgba(25, 26, 82, 1)',
                    'rgba(125, 179, 196, 1)',
                    'rgba(233, 130, 100, 1)',
                    'rgba(200, 10, 4, 1)',
                    'rgba(158, 19, 131,1)',
                    'rgba(186, 15, 255,1)',

                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                        //max: this.max,
                        //callback: function (value) {
                        //    return (value / this.max * 100).toFixed(0) + '%'; // convert it to percentage
                        //},
                    },
                    scaleLabel: {
                        display: true,
                        labelString: labelstring,
                    },

                }]
            }
        }
    }
    if (mychart == null) {
        debugger;

        mychart = new Chart(ctx, config);
    }
    else if (mychart != null) {
        debugger;
        mychart.destroy();
        mychart = new Chart(ctx, config);

    }

};


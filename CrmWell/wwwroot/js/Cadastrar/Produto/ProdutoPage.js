﻿var tabela;
var Editando = false;
var produtoArray = [];
var propriedades = [];
$(document).ready(async () => {
    Produto.Editando = false;
    tabela = await Tabela("dtProduto", "GetProdutosTable");
    await DesbloquearTela();


    $('input[name="Preco"]').maskMoney({
        allowNegative: false,
        thousands: '.',
        decimal: ',',
        affixesStay: false
    }).attr('maxlength', '0.000.000.000,00'.length).trigger('mask.maskMoney');
    //toastr.info('Implementar notificações', "Info", { timeOut: 2000 });


});


$(document).on("click", "#btnNovo", () => {
    Adicionar("#Adicionar", "#Listagem");
    EscondeElemento("#CampoUsuarioCodigo");
    $("#btnSalvar").text("Cadastrar");
    Produto.Novo = true;


});
$(document).on("click", "#btnCancelar", async () => {
    await Cancelar("#Adicionar", "#Listagem");
    ResetaGrupoFormulario($(".Produtopropriedade"))
    Produto = ResetarObjeto(Produto);
    Produto.Editando = false;
    Produto.Novo = false;
    propriedades = [];
});
$(document).on("click", "#btnSalvar", async () => {
    let produto = $("#Produto").serializeArray();
    let produtopropriedade = SerialiazaGrupoForm($(".Produtopropriedade"));
    produtopropriedade.pop();
    let propriedadestemp = [];
    for (var i = 0; i < produtopropriedade.length; i++) {
        let copia = $.extend(true, {}, ProdutoPropriedades);
        copia.Tamanho = produtopropriedade[i][0].value;
        copia.Preco = produtopropriedade[i][1].value;
        copia.Unidades = produtopropriedade[i][2].value;
        copia.Id = Produto.Novo ? null : propriedades[i].Id;
        copia.ProdutoId = Produto.Novo ? null : propriedades[i].ProdutoId;
        copia.DatadeModificacao = new Date().toISOString();
        propriedadestemp.push(copia);
    }

    //if (checarNulos(produto,[0, 1, 5]) || Editando) {
    Produto.Id = produto[0].value;
    Produto.Codigo = produto[1].value;
    Produto.Nome = produto[2].value;
    Produto.propriedades = propriedadestemp;
    debugger;
    //Produto.Editando = Produto.Editando;
    //Preco: produto[3].value,
    //Unidades: produto[4].value,
    //Tamanho: produto[5].value

    //}

    await BloquearTela();
    debugger;
    await $.post("/" + GetController() + "/SalvarProduto", { prod: Produto }, async (e) => {
        if (e) {
            toastr.success("Salvo Com Sucesso", "Sucesso", { timeOut: 2000 })
            await $('#dtProduto').DataTable().ajax.reload();
            await Cancelar("#Adicionar", "#Listagem");
            propriedades = [];
            await DesbloquearTela();
        }
        else {
            await DesbloquearTela();
        }
    });
    //}
    ResetaGrupoFormulario($(".Produtopropriedade"))
    Produto = ResetarObjeto(Produto);
    Produto.Editando = false;
    Produto.Novo = false;

});
///POR HORA TEM QUE COLOCAR ISSO EM TODOS,NAO CONSEGUI AUTOMATIZAR ENTAO E OBRIGATORIO PARA DELETAR E EDITAR

$('#dtProduto tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        for (let i = 0; i < produtoArray.length; i++) {
            if (tabela.row(this).data()['Id'] == produtoArray[i]['Id']) {
                produtoArray[i] = null;

            }

        }
        produtoArray = produtoArray.filter(function (el) {
            return el != null;
        });

    }
    else {
        if (!event.ctrlKey) {
            tabela.$('tr.selected').removeClass('selected');
            produtoArray = [tabela.row(this).data()];
        } else {
            produtoArray.push(tabela.row(this).data());
        }
        $(this).addClass('selected');
    }
});
$('#dtProduto tbody').on('dblclick ', 'tr', function () {
    produtoArray[0] = tabela.row(this).data();
    AparecerElemento("#CampoUsuarioCodigo");
    if (produtoArray[0] != null) {
        ValorInput(produtoArray[0], "Produto");
        Adicionar("#Adicionar", "#Listagem");
        $("#btnSalvar").text("Salvar");
        Produto.Editando = true;
        let prop = $(".Produtopropriedade");
        for (var i = 0; i < prop.length; i++) {
            propriedades.push({ Id: produtoArray[0].Propriedades[i].Id, ProdutoId: produtoArray[0].Propriedades[i].ProdutoId });
            prop[i].Tamanho.value = produtoArray[0].Propriedades[i].Tamanho;
            prop[i].Preco.value = produtoArray[0].Propriedades[i].Preco;
            prop[i].Unidades.value = produtoArray[0].Propriedades[i].Unidades;

        }
    }

    else
        toastr.warning("Selecione um registro", "Editar", { timeOut: 2000 });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).on("click", "#btnDeletar", async () => {
    Deletar();
});
$(document).on("click", "#btnEditar", async () => {
    if (produtoArray.length > 1) {
        toastr.error("Selecione apenas um registro", "Muitas Seleções");
    } else if (produtoArray.length < 1) {
        toastr.warning("Selecione um registro", "Editar", { timeOut: 2000 });
    } else {
        AparecerElemento("#CampoUsuarioCodigo");
        if (!ObjetoENulo(Produto)) {
            Produto.Editando = true;
            ValorInput(produtoArray[0], "Produto");
            await Adicionar("#Adicionar", "#Listagem");
            $("#btnSalvar").text("Salvar");
            let prop = $(".Produtopropriedade");
            for (var i = 0; i < prop.length; i++) {
                propriedades.push({ Id: produtoArray[0].Propriedades[i].Id, ProdutoId: produtoArray[0].Propriedades[i].ProdutoId });
                prop[i].Tamanho.value = produtoArray[0].Propriedades[i].Tamanho;
                prop[i].Preco.value = produtoArray[0].Propriedades[i].Preco;
                prop[i].Unidades.value = produtoArray[0].Propriedades[i].Unidades;

            }
        }
    }



    //DesbloquearTela();



});
//$(document).keydown((k) => {
//    if ((k.keyCode == 46 || k.keyCode == 8) && (!Produto.Novo && !Produto.Editando))
//        Deletar();
//})


function Deletar() {
    if (produtoArray[0] != null) {
        $.post("/" + GetController() + "/DeletarProduto", { prod: produtoArray }, async (retorno) => {
            await BloquearTela();
            if (retorno) {
                await $('#dtProduto').DataTable().ajax.reload();
                Produto = ResetarObjeto(Produto);
                await toastr.success("Produto Apagado", "Sucesso", { timeOut: 2000, preventDuplicates: true, progressBar: true });
            }
            await DesbloquearTela();
        });
    }
    else
        toastr.warning("Selecione um registro", "Deletar", { timeOut: 2000, preventDuplicates: true, progressBar: true });
    produtoArray = [];
}
//function setaSelect(obj, select) {
//    var seletorCriancas = $(select).children();
//    if (typeof select == 'object') {
//    } else if (typeof select == 'string') {
//        for (let i = 0; i < seletorCriancas.length; i++) {
//            if (seletorCriancas[i].value == obj['Tamanho']) {
//                seletorCriancas[i].selected = true;
//            } else {
//                seletorCriancas[i].selected = false;
//                console.log(seletorCriancas[i])
//            }
//        }
//    }


//}






// VALIDAÇÃO JS -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
tiraEspacoDosInputs("Produto", false)
tiraEspacoDosInputs("Produtopropriedade", false)





// -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-
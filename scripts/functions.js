$(function(){

    /* MASCARAS PARA CAMPOS DO FORMULARIO */
    $("#cep").mask('00000-000');

    /* FUNCAO PARA LIMPAR CAMPOS DO FORMULARIO EM CASO DE ERRO */ 
    function limpa_formulário_cep() {
        $("#cep").val("");
        $("#logradouro").val("");
        $("#bairro").val("");
        $("#localidade").val("");
        $("#uf").val("");
    }

    /* FUNCAO PARA MUDAR A COR DA DIV, APENAS ALGO DIVERTIDO QUE DECIDI COLOCAR */
    $('.explicacao i').on('click', function(){
        $('.explicacao').css('background-color','#8e44ad');
    })

    /* FUNCAO PARA LIMPAR OS CAMPOS DO FORMULARIO AO APERTAR O BOTAO */
    $("form").submit(function(e) {
        e.preventDefault();
        limpa_formulário_cep();
    });

    /* REQUISIÇÃO ASSINCRONA PARA ADICIONAR DADOS DA API AOS CAMPOS DO FORMULARIO */ 
    $("#cep").on('blur keypress', function (e) {

        /* ISSO GARANTE QUE A  REQUISICAO SEJA FEITA AO TIRAR O FOCO OU AO APERTAR ENTER */
        var key = e.which;
        if(e.type === 'blur' || key === 13)  // CODIGO DA TECLA ENTER
        {
            e.preventDefault();

            var cep = $(this).val().replace(/\D/g, '');

            /* VERIFICA SE O CAMPO CEP ESTA VAZIO */
            if (cep != "") {
                /* EXPRESSAO REGULAR PARA VALIDAR O CEP */
                var validacep = /^[0-9]{8}$/;

                if(validacep.test(cep)) {
                    fetch(`https://viacep.com.br/ws/${cep}/json/`)

                    .then(res => {
                        res.json()
                        .then(data => showData(data))
                    })

                    const showData = (retorno) => {
                        if(!('erro' in retorno)){
                            for(const campo in retorno){
                                swal('Sucesso!',`Aqui estão as informações referentes ao CEP: ${cep}`,'success');
                                /* RETORNA OS VALORES DA API PARA OS CAMPOS DO FORMULARIO */
                                if(document.querySelector("#"+campo)){
                                    document.querySelector("#"+campo).value = retorno[campo];
                                }
                            }
                            
                        }else{
                            /* CEP PESQUISADO NÃO FOI ENCONTRADO */
                            limpa_formulário_cep();
                            swal('Ocorreu um erro!','CEP não encontrado, por favor tente novamente.','error');
                        }
                    }
                }else{
                    /* FORMATO DO CEP ESTA ERRADO*/
                    limpa_formulário_cep();
                    swal('Ocorreu um erro!','Formato de CEP inválido, por favor tente novamente.','error');
                }
            }else{
                /* CAMPO CEP ESTAVA VAZIO */
                limpa_formulário_cep();
                swal('Ocorreu um erro!','Seu CEP não pode estar incompleto ou vazio, por favor tente novamente.','error');
            }
        }
    });
});
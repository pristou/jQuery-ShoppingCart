/**
 * Created by NIMOUR Rabah Oussama on 28/12/2016.
 */
$(document).ready(function () {
  /***********************************************************************************/  
  /***********************************************************************************/
  /*================================ Shopping Cart ==================================*/
  /***********************************************************************************/  
  /***********************************************************************************/  
  // Tab_panier array containing the product ids added to the shopping cart 
    var tab_panier=[];     
    //Add new product to shopping cart
    $('.add').on('click', function (e) {
        e.preventDefault();
        var add=$(this);
        // Retrieve the product ID 
        var id_product=add.attr('id-data');
        //Retrieve the number of times is the selected product
        var checked=add.parent().parent().parent().find('#nbr-check');
        //Check if the product is already in the shopping cart
        if($.inArray(id_product,tab_panier)==-1){
            // If the product does not exist in the shopping cart, than add it to the shopping cart
            tab_panier.push(id_product);
            var q=1;
            var tr=
                '<tr id="ligne">' +
                    '<td class="id_produit hidden" id-data="'+id_product+'" ></td> '+
                    '<td class="nom">'+add.parent().parent().parent().find('.name_product').text()+'</td>'+
                    '<td class="prix">'+add.parent().parent().parent().find('.price-u').text()+'</td>'+
                    '<td class="qte"><span class="quantite">'+q+'&nbsp;</span><button id="addQ" class="btn btn-info btn-sm plusmoin btn-raised"><em class="fa fa-plus"></em></button><button id="reduce" class="btn btn-warning btn-sm plusmoin btn-raised"><em class="fa fa-minus"></em></button> </td>'+
                    '<td class="total">'+add.parent().parent().parent().find('.price-u').text()+'</td>'+
                    '<td><a href="#" id="remove_cart" class="remove_cart"><i class="fa fa-times"></i></a></td>'+
                '</tr>';
            $('tbody').prepend(tr)
            $.notify({
                    // Options
                    icon: 'fa fa-check-circle',
                    message: 'Product has been successfully added',

                },
                {
                    // settings
                    type: 'success',
                    offset: {
                        x: 10,
                        y: 60
                    },
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    }
                }
            );

            checked.parent().removeClass('hidden')
            checked.text('1')
        }else{
            //If the product is in the shopping cart, increments the quantity + the price of the product
            $('tbody').find('tr').each(function () {
                if(id_product==$(this).find('.id_produit').attr('id-data')){
                    $newq=parseInt($(this).find('.quantite').html())+1;
                    $newp=parseFloat($(this).find('.prix').html())*$newq;
                    $(this).find('.quantite').text($newq);
                    $(this).find('.total').text($newp.toFixed(2))
                    checked.text(parseInt(checked.html())+1);
                }
            })
        }
        //Calculate the total
        var total=0;
        $('tbody').find('tr').each(function () {
            total=total+parseFloat($(this).find('.total').html())
        })
        $('#price').text(total.toFixed(2));


    })

    //remove product
    $('table').on('click','.remove_cart', function (e) {
        e.preventDefault();
        var remove=$(this);
        //Retrieve the product ID 
        var id_product_delete_rp=remove.parents('tr').find('.id_produit').attr('id-data');
        //Modal box appears to confirm the removal of the product
        bootbox.confirm("are you sure ?",function (result) {       
            if(result){
                //If YES, delete the product from the shopping cart and calculate the new total
                if($.inArray(id_product_delete_rp,tab_panier)>=0){
                    _.remove(tab_panier, function (n) {
                        return n==id_product_delete_rp;
                    })
                    $newtotal_rp=parseFloat($('#price').html())-parseFloat(remove.parent().parent().find('.total').html());
                    $('#price').text($newtotal_rp.toFixed(2));
                    $('#products').find('.info').each(function () {
                        if(id_product_delete_rp==$(this).find('.add').attr('id-data')){
                            $(this).find('#nbr-check').text('')
                            $(this).find('#checked').addClass('hidden')
                        }
                    })
                    remove.parents('tr').hide('slow', function(){ remove.parents('tr').remove(); });
                }
                else{
                    bootbox.alert("Impossile to remove the product!!!")
                }
            }
            else{
                console.log("annulation")
                }          
        })
    })

    //Add quantity
    $('table').on('click','#addQ', function (e) {
        e.preventDefault();
        var add=$(this); 
        //Retrieve the product ID    
        $newtotalproduct=parseFloat(add.parent().parent().find('.total').html())+parseFloat(add.parent().parent().find('.prix').html());
        $newalltotal=parseFloat(add.parent().parent().find('.prix').html())+parseFloat($('#price').html());
        add.parent().parent().find('.quantite').text(parseInt(add.parent().parent().find('.quantite').html())+1);
        add.parent().parent().find('.total').text($newtotalproduct.toFixed(2));
        $('#price').text($newalltotal.toFixed(2));
        $('#products').find('.info').each(function () {
            if(add.parent().parent().find('.id_produit').attr('id-data')==$(this).find('.add').attr('id-data')){
                $(this).find('#nbr-check').text(parseInt($(this).find('#nbr-check').html())+1 )
            }
        })

    })
    //reduce quantity
    $('table').on('click','#reduce', function (e) {
        e.preventDefault();
        var reduce=$(this);
        var t=0;
        $total=parseFloat(reduce.parent().parent().find('.total').html());
        $newalltotal=parseFloat(reduce.parent().parent().find('.total').html())-parseFloat(reduce.parent().parent().find('.prix').html());
        //Retrieve the product ID 
        var id_product_delete=reduce.parent().parent().find('.id_produit').attr('id-data');
        var new_quantity=parseInt(reduce.parent().parent().find('.quantite').html())-1;
        if(new_quantity<=0){
            bootbox.confirm("you will remove the product, are you sure ?", function (r) {
                if(r){

                    if($.inArray(id_product_delete,tab_panier)>=0){
                        _.remove(tab_panier, function (n) {
                            return n==id_product_delete;
                        })
                        reduce.parents('tr').hide('slow', function(){ reduce.parents('tr').remove(); });

                        $new_total_all_products=parseFloat($('#price').html())-$total;
                        if($new_total_all_products<=0){
                            $('#price').text('0');
                        }else{
                            $('#price').text($new_total_all_products.toFixed(2))
                        }

                        $('#products').find('.info').each(function () {
                            if(id_product_delete==$(this).find('.add').attr('id-data')){
                                $(this).find('#nbr-check').text('')
                                $(this).find('#checked').addClass('hidden')
                            }
                        })
                    }

                }
            })
        }else{
            $('#products').find('.info').each(function () {
                if(id_product_delete==$(this).find('.add').attr('id-data')){
                    $(this).find('#nbr-check').text(parseInt($(this).find('#nbr-check').html())-1)
                }
            })
            reduce.parent().parent().find('.total').text($newalltotal.toFixed(2));
            reduce.parent().parent().find('.quantite').text(new_quantity);
            $('tbody').find('tr').each(function () {
                t=t+parseFloat($(this).find('.total').html())
            })
            $('#price').text(t.toFixed(2));
            t=0;
        }
    })
  /***********************************************************************************/  
  /***********************************************************************************/
  /*================================ Search product =================================*/
  /***********************************************************************************/  
  /***********************************************************************************/  
    var content=$('.mas');
    content.masonry({
        // options
        itemSelector: '.col-md-3',
        //columnWidth: '.col-md-4',
        //percentPosition: true
    });    

    $('#search').keyup(function(e) {
        e.preventDefault();
        var val=$(this).val();
        if(val ==''){
            $('.filter span').removeClass('highlighted');
            
        } 
        var regexp='\\b(.*)';
        for(var i in val){
            regexp+='('+val[i]+')(.*)';
        }
        regexp+='\\b';
       
        $('.filter').show();
        content.masonry('reloadItems');
        content.masonry('layout');

        $('.filter').find('h4>span').each(function () {
            var span=$(this);
            var resultat=span.text().match(new RegExp(regexp,'i'));
            if(resultat){
                var string='';
                for(var i in resultat){
                    if(i>0){
                        if(i%2==0){
                            string+='<span class="highlighted">'+resultat[i]+'</span>';
                        }else{
                            string += resultat[i];
                        }
                    }
                }
                span.empty().append(string);
            }else{
                span.parent().parent().parent().parent().parent().parent().hide().fadeOut();
                content.masonry('reloadItems');
                content.masonry('layout');
                return

            }


        })                         
    });

    $('.reset').click(function (e) {
        e.preventDefault();
        $('.filter').find('span').each(function () {
            $('span').removeClass('highlighted');
        })
        $('.filter').show();
        content.masonry('reloadItems');
        content.masonry('layout');
        console.log($('#search').val())
        if($('#search').val()!="")
            $('#search').val("")
    })
})
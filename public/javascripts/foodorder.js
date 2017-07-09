function increase(vegId){

  console.log(vegId);
    // current_value = document.getElementById("numPallets").value;
    // current_veg_value = document.getElementById(vegId).value;
    // if (current_value<21){
    //   new_value = parseInt(current_value) + 1;
    //   new_veg_value = parseInt(current_veg_value) + 1;
    //   document.getElementById('estCost').value = new_veg_value*2000*costperlb;
    //   document.getElementById(vegId).value = new_veg_value;
    //   document.getElementById("numPallets").value = new_value;
    //   update_db(vegId, truckId, new_value);
    // }
 	}
 	function reduce(vegId,truckId,costperlb){
    current_value = document.getElementById("numPallets").value;
    current_veg_value = document.getElementById(vegId).value;
    if (current_value>0){
      new_value = parseInt(current_value) - 1;
      new_veg_value = parseInt(current_veg_value) - 1;
      document.getElementById('estCost').value = new_veg_value*2000*costperlb;
      document.getElementById(vegId).value = new_veg_value;
      document.getElementById("numPallets").value = new_value;
      update_db(vegId, truckId, new_value, new_veg_value);
 	}
}
  function update_db(vegId, truckId,new_value,new_veg_value) {
    $.ajax({
      url: '/plus_minus',
      dataType: "json",
      method: "POST",
      data: {
        vegId: vegId,
        totalPallet: new_value,
        truckId: truckId,
        vegPallet: new_veg_value
        },
      success: function(data, textStatus, jqXHR){
        console.log("Success");
      }
    });
  }

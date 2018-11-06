// finds provided price using regex
// if total element is not created, creates total element and writes total price into it
// if total element exists, calculates new total price and writes it into the element
function handleTotalCost($fieldset, $input, checked) {
  const priceRegex = /\$\d+/i; // regex to find price value
  // get price from activity label
  const activityPrice = $input.parent().text().match(priceRegex)[0].slice(1);
  let $totalElement = $fieldset.children('h3'); // look for total element

  if ($totalElement.length === 0) {
    $fieldset.append(`<h3>Total: $${activityPrice}</h3>`);
  } else {
    let total = $totalElement.text().match(priceRegex)[0].slice(1); // get price from total element
    total = parseInt(total);
    total = checked ? total + parseInt(activityPrice) : total - parseInt(activityPrice);
    $totalElement.text(`Total: $${total}`);
  }
}

// displays tooltip with warning message
function displayWarning($elem, message) {
  // if tooltip doesnt exist, create it
  if ($elem.prev().children('.tooltip').length === 0) {
    $elem.css('border-color', 'red');
    $elem.prev().addClass('warning');
    $elem.prev().append(`<p class="tooltip">${message}</p>`)
  } else {
    $elem.prev().children('.tooltip').text(message);
  }
}

// removes tooltip from provided element
function removeWarning($elem) {
  $elem.css('border-color', '');
  $elem.prev().removeClass('warning');
  $elem.prev().children('.tooltip').remove();
}

function validateName($name) {
  const regex = /[a-z]+\s([a-z]+\s)?[a-z]+/i; // regex for two words with optional third word
  if ($name.val().length === 0) {
    displayWarning($name, 'Name field can\'t be empty!');
    return false;
  } else if (!regex.test($name.val())) {
    displayWarning($name, 'The name must be your full name. Middle name is optional.');
  } else {
    removeWarning($name);
    return true;
  }
}

function validateEmail($email) {
  const regex = /\w+@[a-zA-Z]+\.[a-z]{3,}/i; // regex for validly formatted e-mail address (vlad@treehouse.com)

  if ($email.val().length === 0) {
    displayWarning($email, 'Email field can\'t be empty!');
    return false;
  } else if (!regex.test($email.val())) {
    displayWarning($email, 'Email field must be a validly formatted e-mail address!');
    return false;
  } else {
    removeWarning($email);
    return true;
  }
}

function validateActivities($activities) {
  // if at least one activity is checked
  if ($activities.find('input:checked').length > 0) {
    $activities.removeClass('warning');
    $activities.children('.tooltip').remove();
    return true;
  } else {
    $activities.addClass('warning');
    $activities.append('<p class="tooltip" style="top: 0;">At least one activity must be selected!</p>');
    return false;
  }
}

function validatePayment($payment) {
  const $creditInfo = $('#credit-card');
  const $cardNumber = $('#cc-num');
  const $zip = $('#zip');
  const $cvv = $('#cvv');
  const cardRegex = /\d{13,16}/;
  const zipRegex = /\d{5}/;
  const cvvRegex = /\d{3}/;

  let validNumber = false;
  let validZip = false;
  let validCvv = false;
  
  // creates warning tooltip with provided ID and style
  // ID is used to remove correct warning tooltip when a field value is valid
  // Style is used to place tooltip correctly
  function displayWarning($element, message, id, customStyle) {
    // if tooltip doesn't exist, create one
    if ($('#' + id).length === 0) {
      $element.css('border-color', 'red');
      $element.prev().css('color', 'red');
      $creditInfo.addClass('warning');
      $creditInfo.append(`<p id="${id}" class="tooltip" style="${customStyle}">${message}</p>`);
    } else {
      $('#' + id).text(message);
    }
  }

  // removes tooltip using provided ID
  // removes warning css from the provided field
  function removeWarning($element, tooltipID) {
    $element.css('border-color', '');
    $element.prev().css('color', '');
    $('#' + tooltipID).remove();
  }

  if ($cardNumber.val().length === 0) {
    displayWarning($cardNumber, 'Seems like you forgot about card number. Enter it in the provided field, please!',
                    'card-warning', 'top: 0;');
    validNumber = false;
  } else if (!cardRegex.test($cardNumber.val())) {
    displayWarning($cardNumber, 'Credit Card Number must be a number between 13 and 16 digits!',
                  'card-warning', 'top: 0;');
    validNumber = false;
  } else {
    removeWarning($cardNumber, 'card-warning');
    validNumber = true;
  }

  if (zipRegex.test($zip.val())) {
    removeWarning($zip, 'zip-warning');
    validZip = true;
  } else {
    displayWarning($zip, 'The Zip Code must be a 5-digit number!', 'zip-warning', 'top: 100px;');
    validZip = false;
  }

  if (cvvRegex.test($cvv.val())) {
    removeWarning($cvv, 'cvv-warning');
    validCvv = true;
  } else {
    displayWarning($cvv, 'The CVV must be a 3 digits long number!', 'cvv-warning', 'top: 175px;');
    validCvv = false;
  }

  // if all fields are valid, remove warning class from div
  if (validNumber && validZip && validCvv) {
    $creditInfo.removeClass('warning');
  }

  return validNumber && validZip && validCvv;
}

$(document).ready(() => {
  const $name = $('#name');
  const $email = $('#mail');
  const $title = $('#title');
  const $design = $('#design');
  const $colors = $('#colors-js-puns');
  const $activities = $('fieldset.activities');
  const $payment = $('#payment');
  const $otherTitle = $('#other_title');
  const $paypalInfo = $('#credit-card').next();
  const $bitcoinInfo = $paypalInfo.next();

  // set initial look of the page
  $('input:first').focus();
  $otherTitle.prev().hide();
  $otherTitle.hide();
  $paypalInfo.hide();
  $bitcoinInfo.hide();
  $design.children(':first').attr('disabled', true);
  $colors.hide();

  // real time validation
  $name.keyup(() => {
    validateName($name);
  });

  $email.keyup(() => {
    validateEmail($email);
  });

  $title.change(function() {
    // if 'other' job title is selected display input field
    let selectedValue = $(this).find('option:selected').val(); 
    if (selectedValue === 'other') {
      $otherTitle.prev().show();
      $otherTitle.show();
    } else {
      $otherTitle.prev().hide();
      $otherTitle.hide();
    }
  });

  $design.change(function() {
    const selectedValue = $(this).children('option:selected').val();
    const regex = selectedValue === 'js puns' ? /js puns/i : /i . js/i; // regex used to find correct colors depending on the design
    let colorSelected = false;

    // loop through all colors and show only the ones that match regex
    $('#color').children().each(function() {
      const text = $(this).text();
      if (regex.test(text)) {
        // make sure correct color is selected by default
        if (!colorSelected) {
          $('#color').children('option:selected').removeAttr('selected');
          $(this).attr('selected', true); // select first matching color
          colorSelected = true;
        }
        $(this).show();
      } else {
        $(this).hide();
      }
    });

    $colors.show();
  });

  $activities.on('change', 'input', function() {
    const timeRegex = /[a-z]+\s\d+[ap]m-\d+[ap]m/i; // regex for date and time of an activity
    const match = $(this).parent().text().match(timeRegex);
    const activityTime = match ? match[0] : null; // if we found activity time store it
    const checked = $(this).prop('checked');

    // disable activities with the same date and time
    $activities.children('label').each(function() {
      if ($(this).text().match(activityTime)) {
        if (checked) {
          // make sure that checked activity won't be disabled
          if (!$(this).children(':first').prop('checked')) {
            $(this).css('opacity', '.5');
            $(this).children(':first').attr('disabled', true);
          }
        } else {
          $(this).css('opacity', '1');
          $(this).children(':first').removeAttr('disabled');
        }
      }
    });

    handleTotalCost($activities, $(this), checked);
    validateActivities($activities);
  });

  $payment.change(function() {
    const selectedValue = $(this).children('option:selected').val();
    switch (selectedValue) {
      case 'paypal':
        $(this).next().hide();
        $paypalInfo.show();
        $bitcoinInfo.hide();
        break;
      case 'bitcoin':
        $(this).next().hide();
        $paypalInfo.hide();
        $bitcoinInfo.show();
        break;
      default:
        $(this).next().show();
        validatePayment($payment);
        $paypalInfo.hide();
        $bitcoinInfo.hide();
        break;
    }
  });

  $('#credit-card').on('keyup', 'input', function() {
    validatePayment($payment);
  });

  $('form').submit(function(e) {
    let valid = false;
    
    if (validateName($name)) valid = true;
    else valid = false;

    if (validateEmail($email)) valid = true;
    else valid = false;

    if (validateActivities($activities)) valid = true;
    else valid = false;

    if ($payment.children('option:selected').val() === 'credit card') {
      if (validatePayment($payment)) valid = true;
      else valid = false;
    }

    if (!valid) e.preventDefault();
  });
});
function handleTotalCost($fieldset, $input, checked) {
  const priceRegex = /\$\d+/i;
  const activityPrice = $input.parent().text().match(priceRegex)[0].slice(1);
  let $totalElement = $fieldset.children('h2');

  if ($totalElement.length === 0) {
    $fieldset.append(`<h2>Total: $${activityPrice}</h2>`);
  } else {
    let total = $totalElement.text().match(priceRegex)[0].slice(1);
    total = parseInt(total);
    total = checked ? total + parseInt(activityPrice) : total - parseInt(activityPrice);
    $totalElement.text(`Total: $${total}`);
  }
}

function validateName($name) {
  if ($name.val().length === 0) {
    $name.css('border-color', 'red');
  } else {
    $name.css('border-color', '');
  }
}

function validateEmail($email) {
  const regex = /\w+@\[a-zA-Z]+\.\[a-z]{3,}/i;
}

$(document).ready(() => {
  const $name = $('#name');
  const $email = $('#mail');
  const $title = $('#title');
  const $design = $('#design');
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

  $title.change(function() {
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
    const regex = selectedValue === 'js puns' ? /js puns/i : /i . js/i;
    let colorSelected = false;

    $('#color').children().each(function() {
      const text = $(this).text();
      if (regex.test(text)) {
        if (!colorSelected) {
          $('#color').children('option:selected').removeAttr('selected');
          $(this).attr('selected', true);
          colorSelected = true;
        }
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  $activities.on('change', 'input', function() {
    const timeRegex = /\d+[ap]m-\d+[ap]m/i;
    const match = $(this).parent().text().match(timeRegex);
    const activityTime = match ? match[0] : null;
    const checked = $(this).prop('checked');

    $activities.children('label').each(function() {
      if ($(this).text().match(activityTime)) {
        if (checked) {
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
        $paypalInfo.hide();
        $bitcoinInfo.hide();
        break;
    }
  });

  $('form').submit(function(e) {
    validateName($name);


    e.preventDefault();
  });
});
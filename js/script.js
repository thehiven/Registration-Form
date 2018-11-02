function handleActivitiesInput(checked) {

}

$(document).ready(() => {
  const $otherTitle = $('#other_title');

  $('input:first').focus();
  $otherTitle.prev().hide();
  $otherTitle.hide();

  $('#title').change(function() {
    let selection = $(this).find('option:selected').val();
    if (selection === 'other') {
      $otherTitle.prev().show();
      $otherTitle.show();
    } else {
      $otherTitle.prev().hide();
      $otherTitle.hide();
    }
  });

  $('#design').change(function() {
    const selection = $(this).children('option:selected').val();
    const regex = selection === 'js puns' ? /js puns/i : /i . js/i;
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

  $('fieldset.activities').on('change', 'input', function() {
    const regex = /\d+[ap]m-\d+[ap]m/i;
    const activityTime = $(this).parent().text().match(regex)[0];
    const checked = $(this).prop('checked');
    const activities = $('fieldset.activities');

    if (checked) {
      activities.children('label').each(function() {
        if ($(this).text().match(activityTime)) {
          if (!$(this).children(':first').prop('checked')) {
            $(this).css('opacity', '.5');
            $(this).children(':first').attr('disabled', true);
          }
        }
      });
    } else {
      
    }
  });
});

const headJumbo = $("#headjumbo");
const historyCard = $("#history-card");
const todayCard = $("#today");
const firstDayCard = $("#day-1");
const secondDayCard = $("#day-2");
const thirdDayCard = $("#day-3");
const fourthDayCard = $("#day-4");
const fifthDayCard = $("#day-5");


function showMainUI() {
  $(headJumbo).delay(200).animate({
    opacity: 1
  }, 80, function() {
    $(historyCard).animate({
      opacity: 1
    }, 80)
  })
};

// Show elements of the interface that are hidden on page load
function showDetailsCards() {
  $(todayCard).animate({
    opacity: 1
  }, 60, function () {
    $(firstDayCard).animate({
      opacity: 1
    }, 60, function () {
      $(secondDayCard).animate({
        opacity: 1
      }, 60, function () {
        $(thirdDayCard).animate({
          opacity: 1
        }, 60, function () {
          $(fourthDayCard).animate({
            opacity: 1
          }, 60, function () {
            $(fifthDayCard).animate({
              opacity: 1
            }, 60);
          })
        })
      })
    })
  })
};

// Used ONLY on erasing data to hide elements again as on page load
function hideDetailsCards() {
  $(fifthDayCard).animate({
    opacity: 0
  }, 60, function () {
    $(fourthDayCard).animate({
      opacity: 0
    }, 60, function () {
      $(thirdDayCard).animate({
        opacity: 0
      }, 60, function () {
        $(secondDayCard).animate({
          opacity: 0
        }, 60, function () {
          $(firstDayCard).animate({
            opacity: 0
          }, 60, function () {
            $(todayCard).animate({
              opacity: 0
            }, 60);
          })
        })
      })
    })
  })
};
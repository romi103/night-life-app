//delete poll
$(".deletePoll").click(function () {
    var target = $(event.target);
    var $link = $(this).next();
    var pollId = $link.val();
    console.log(pollId);

    var r = confirm("Are you sure you want to remove the poll?");
    if (r == true) {
        $.post("/deletePoll", {pollId: pollId}).done(function (data) {
            reloadSite();

        });
    }
});


//accordion - dropdown poll info
$(".votePoll").click(function () {
    var target = $(event.target);
    var $link = $(this).next();
    var pollId = $link.val();


    $('#votePoll').modal({
        keyboard: false
    });


    $.get('/getpoll/' + pollId + "", function (poll) {


        //accordionBody.append(el_html);//call to mustah template
        var arrLabels = poll[0].labels;
        var radioForm = $(document.createElement("form"))
            //radioForm.setAttribute("class", "pollOption");
        arrLabels.forEach(function (element, index, array) {
            radioForm.append("<input type='radio' name='votaData' class='voteData' value='" + element + "'>" + element + "<br>");

        });
        $(".voteBody").empty();
        $('#saveVote').next().remove();
        $(".voteFooter").append("<input type='hidden' class='voteData' name='votedPollId' value=" + poll[0]._id + ">");
        $(".voteBody").append(radioForm);

    });

});

//save vote poll
$("#saveVote").click(function () {
    var voteFormData = $(".voteData").serialize();
    var $link = $("#saveVote").next();
    var pollId = $link.val();



    if ($('input[class="voteData"]:checked').length > 0) {
        var vote = $(".voteData").serialize();
        console.log(vote);
        $.post("/votePoll", vote).done(function (data) {
            reloadSite();

        });
        $('#votePoll').modal('hide');
    } else {
        alert("Select option you want to vote on!");
    }

});


$('.panel-title').on('click', function (event) {

    var target = $(event.target);


    var $link = $(this).children();
    var pollId = $link.val();

    //class 'userPolls' added to HTML that draws users polls if they are logged
    if (target.is(".userPolls")) {
        var accordionBody = $("#acordion-user-" + pollId);
        var chartCanvas = $("#chart-user-" + pollId);
    } else {
        var accordionBody = $("#acordion-" + pollId);
        var chartCanvas = $("#chart-" + pollId);
    }

    accordionBody.on('show.bs.collapse', function () {


        if (!accordionBody.children().is("iframe")) {



            $.get('/getpoll/' + pollId + "", function (poll) {
                $('#some').css({
                    "display": "none"
                });

//                var source = $("#entry-template").html();
//                var template = Handlebars.compile(source);
//                var el_html = template(poll);


                //accordionBody.append(el_html);//call to mustah template
                var arrLabels = poll[0].labels;
                var arrDataset = poll[0].dataset;
                var pollName = poll[0].pollName;

                //draws 
                drawPoll(arrLabels, arrDataset, pollName, chartCanvas);

            });
        }
    });
});

function drawPoll(arrlabels, arrDataset, pollName, ctx) {
    var colors = randomColor({
        count: arrDataset.length
    });
    var data = {
        datasets: [{
            data: arrDataset,
            backgroundColor: colors,
            label: 'Dataset 1'
            }],
        labels: arrlabels
    }



    //var ctx = document.getElementById("myChart");
    if (myChart) {
        myChart.destroy();
    }
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            legend: {
                position: 'bottom'

            },
            labels: {
                fontSize: 18
            },
            title: {
                display: true,
                text: pollName,
                fontSize: 24
            },
            animation: {
                animateScale: true,
                animateRotate: false
            }
        }
    });
    Chart.defaults.global.responsive = true;
}

$("#accordion").collapse();
$("#saveButton").click(function () {

    $("#addDatasetInput").off();

    // $('#newPollModal').modal('hide');

    var $pollNameValue = $('#pollName').val();
    var $dataSet = $('.dataSet');

    //validation if each element from data set is unique
    var arrayDataSet = [];
    var valuesToCheck = [];
    var emptyString;
    var sameInputs;
    var noPollName;
    var errorText = "";


    if (!$("#pollName").val()) {
        noPollName = true;
        errorText = "Poll name is empty";
    }

    $dataSet.each(function (index) {
        //cheking if there is an empty string
        if ($(this).val()) {
            arrayDataSet.push($(this).val());
        } else {
            errorText = errorText + "\nThere is an empty string";
            emptyString = true;
        }

    });
    //checking if there are repetition

    $.each(arrayDataSet, function (i, el) {
        if ($.inArray(el, valuesToCheck) === -1) valuesToCheck.push(el);
    });

    if (arrayDataSet.length !== valuesToCheck.length) {
        sameInputs = true;
        errorText = errorText + '\nProvided inputs are the same.';
    }

    if (!sameInputs && !emptyString && !noPollName) {
        alert("Thank you for submitting the poll");
        var formData = $(".data").serialize();

        $.post("/newpoll", formData).done(function (data) {
            $('#newPollModal').modal('hide');

            reloadSite();
        });
    } else {
        alert(errorText);
    }

});


//modal functionality
$('#addNewPoll').click(function () {
    $('#newPollModal').modal({
        keyboard: false
    });


    var modalBody = document.getElementById('modalBody');


    //adding input to the poll modal
    $("#addDatasetInput").click(function () {
        var newInput = $(this).before('<div class="form-group"><input type="text" class="dataSet data" name="labels"><button type="button" class="close removeInput" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>').end();

        $('.removeInput').click(function (e) {
            var targetDiv = $(e.target).parent().parent();
            targetDiv.remove();
        });
    });

});

//rest new poll form
$('#resetButt').click(function(){
        document.getElementById("createPollForm").reset();
  });

function reloadSite() {
    $("#siteParent").addClass("loading");
    $('#siteChild').load(document.URL + "#siteChild", function () {
        $("#siteParent").removeClass("loading");
    });

}


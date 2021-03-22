$(document).ready(function() {

    // setTimeout(function(){
    //     AOS.init({
    //       duration: 500,
    //       easing:"ease-in-out",
    //       once: false,
    //       offset: 100,
    //       disable: false
    //     });
    // },200);

    let firstTime = true; // indicates if the user visits the website for the first time from the cookies . if first time => true else => false
    setTimeout(function(){
        $('.splash-screen').fadeOut("slow", function(){
            if(firstTime) $('#cookies-modal').modal('show') // shows the cookies modal only for the first visit
        });
      },100)

    let menuState = "hidden";

    const toggleNav = function(){
        if(menuState == "hidden"){
            $("#full-overlay").addClass("show");
            $("#main-nav .navbar-toggler").addClass("togglerClose");
            $('body').addClass('show-menu');
            menuState = "shown";
        }
        else{
            $("#full-overlay").removeClass("show");
            $("#main-nav .navbar-toggler").removeClass("togglerClose");
            $('body').removeClass('show-menu');
            menuState = "hidden";
        }
    }

    const navbarTop = function(){
        if(window.pageYOffset < 50){
            $('#main-nav').addClass('navbar-top');
        }else{
            $('#main-nav').removeClass('navbar-top');

        }
    }

    navbarTop();


    $("#main-nav .navbar-toggler").on('click',function(){
        toggleNav();
    })


    $(window).on('scroll', function(){
        navbarTop();
    })
    
    $(window).on('resize', function(){
        if($(document).width() > 767){
            if(menuState == "shown"){
                toggleNav();
            }
        }
    })

    $('.smooth-scroll').on('click',function(event){
        event.preventDefault();
        var hash = $(this).attr('href');
        if(menuState == "shown"){
          toggleNav();
      }
        $('html, body').animate({
          scrollTop: $(hash).offset().top-100
        },500)
      
  })

    let modalSwiperIndex = 0;
    $('[data-target="#images-modal"]').on('click', function(){
        $(this).parents('.images-parent').find('[data-target="#images-modal"]').each(function(img){
            let url = '';
            if($(this).prop('tagName') == 'IMG'){
                url = $(this).attr('src');
            }else{
                url = $(this).css('background-image').replace('url(','').replace(')','').replace(/\"/gi, "");
            }
            let slide = `<div class="swiper-slide">
                            <img src="${url}" class="img-fluid w-100">
                        </div>`;
            modalSwiper.appendSlide(slide);
        })
        modalSwiperIndex = $(this).parents('.images-parent').find('[data-target="#images-modal"]').index($(this));
        $('#images-modal').modal('show')
    })

    $('#images-modal').on('shown.bs.modal', function(){
        modalSwiper.update();
        modalSwiper.slideToLoop(modalSwiperIndex)
    })

    $('#images-modal').on('hidden.bs.modal', function(){
        $('#images-modal .swiper-wrapper').text('');
        modalSwiper.update();
    })

    const modalSwiper = new Swiper('#images-modal .swiper-container', {
        slidesPerView:1,
        spaceBetween: 10,
        autoHeight: true,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '#images-modal .swiper-button-next',
            prevEl: '#images-modal .swiper-button-prev',
        },
        observer: true,
    });

    // contact form
    $('#contact-form').on('submit', function(e){
        e.preventDefault();
        if(formValidate($('#contact-form'))){
            // here goes the ajax code to submit the form to the required page
            // and on success, goes this line $('#success-modal').modal('show'); which shows the success modal
            $('#success-modal').modal('show');
            // on error for any reason on the server this below line is uncommented to show the failure modal
            // $('#failure-modal').modal('show');
        }

    })

    $('#resend-contact-form').on('click', function(){
        $('#contact-form').submit();
    })
    
    const errorMessagesEn = {
        'required':'Make sure you fill all inputs',
    }
    const errorMessagesGr = {
        'required':'Make sure you fill all inputs (in GR)',
    }

    let errorMessages = {}

    if(document.documentElement.lang == 'gr'){
        errorMessages = errorMessagesGr;
    }else{
        errorMessages = errorMessagesEn;
    }

    function formValidate(frm){
        let errors = [];
        $('.alert').alert('dispose');
        $('#contact-alert-container').fadeOut()
        $('input, textarea').removeClass('is-invalid')
    
        frm.find('[data-validate]').each(function(){
          let rules = $(this).data('validate').split('-');
          // rules
          if(rules.includes("required")){
            if($(this).val() == ''){
              $(this).addClass('is-invalid')
              if(!errors.includes(errorMessages.required)){
                errors.push(errorMessages.required);
              }
            }
          }
        })
          if(errors.length == 0){
            return true;
          }else{
            let alertHtml = `
            <div
              class="alert alert-danger alert-dismissible show fade mb-4"
              role="alert"
              id="error-alert">
              <ul class="mb-0 px-2">`;
              for(error in errors){
                alertHtml += `<li>${errors[error]}</li>`;
              }
              alertHtml += `
              </ul>
              <button
                  type="button"
                  class="close"
                  data-dismiss="alert"
                  aria-label="Close"
              >
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>`;
        
            $('#contact-alert-container').html(alertHtml)
            $('#contact-alert-container').fadeIn()
            return false
          }
      }
});
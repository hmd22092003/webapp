(function () {
    'use strict';

    // iPad and iPod detection    
    var isiPad = function(){
        return (navigator.platform.indexOf("iPad") != -1);
    };

    var isiPhone = function(){
        return (
            (navigator.platform.indexOf("iPhone") != -1) || 
            (navigator.platform.indexOf("iPod") != -1)
        );
    };

    var fullHeight = function() {
        $('.js-fullheight').css('height', $(window).height());
        $(window).resize(function(){
            $('.js-fullheight').css('height', $(window).height());
        });
    };

    var burgerMenu = function() {
        $('.js-colorlib-nav-toggle').on('click', function(event) {
            event.preventDefault();
            var $this = $(this);
            if( $('body').hasClass('menu-show') ) {
                $('body').removeClass('menu-show');
                $('#colorlib-main-nav > .js-colorlib-nav-toggle').removeClass('show');
            } else {
                $('body').addClass('menu-show');
                setTimeout(function(){
                    $('#colorlib-main-nav > .js-colorlib-nav-toggle').addClass('show');
                }, 900);
            }
        })
    };

    // Animations
    var contentWayPoint = function() {
        var i = 0;
        $('.animate-box').waypoint( function( direction ) {
            if( direction === 'down' && !$(this.element).hasClass('animated') ) {
                i++;
                $(this.element).addClass('item-animate');
                setTimeout(function(){
                    $('body .animate-box.item-animate').each(function(k){
                        var el = $(this);
                        setTimeout( function () {
                            var effect = el.data('animate-effect');
                            if ( effect === 'fadeIn') {
                                el.addClass('fadeIn animated');
                            } else {
                                el.addClass('fadeInUp animated');
                            }
                            el.removeClass('item-animate');
                        },  k * 200, 'easeInOutExpo' );
                    });
                }, 100);
            }
        } , { offset: '85%' } );
    };

    var counter = function() {
        $('.js-counter').countTo({
            formatter: function (value, options) {
                return value.toFixed(options.decimals);
            },
        });
    };

    var counterWayPoint = function() {
        if ($('#colorlib-counter').length > 0 ) {
            $('#colorlib-counter').waypoint( function( direction ) {
                if( direction === 'down' && !$(this.element).hasClass('animated') ) {
                    setTimeout( counter , 400);                    
                    $(this.element).addClass('animated');
                }
            } , { offset: '90%' } );
        }
    };

    // Owl Carousel
    var owlCarouselFeatureSlide = function() {
        var owl = $('.owl-carousel1');
        owl.owlCarousel({
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            autoplay: true,
            loop:true,
            margin:0,
            nav:true,
            dots: false,
            autoHeight: true,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:2
                },
                1000:{
                    items:3
                }
            },
            navText: [
                "<i class='icon-arrow-left3 owl-direction'></i>",
                "<i class='icon-arrow-right3 owl-direction'></i>"
            ]
        });
        var owl2 = $('.owl-carousel');
        owl2.owlCarousel({
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            autoplay: true,
            loop:true,
            margin:0,
            nav:false,
            dots: true,
            autoHeight: true,
            items: 1,
            navText: [
                "<i class='icon-arrow-left3 owl-direction'></i>",
                "<i class='icon-arrow-right3 owl-direction'></i>"
            ]
        });
        var owl3 = $('.owl-carousel3');
        owl3.owlCarousel({
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            autoplay: true,
            loop:true,
            margin:0,
            nav:false,
            dots: false,
            autoHeight: true,
            items: 1,
            navText: [
                "<i class='icon-arrow-left3 owl-direction'></i>",
                "<i class='icon-arrow-right3 owl-direction'></i>"
            ]
        });
    };

// Danh sách nhãn trái cây tiếng Anh
const labels = ["apple", "banana", "chilli pepper", "corn", "cucumber",
	"grapes", "kiwi", "lemon", "mango", "orange",
	"pear", "pineapple", "pomegranate", "tomato", "watermelon"];

// Tạo đối tượng ánh xạ tiếng Anh -> tiếng Việt
const labelsVietnamese = {
"apple": "Táo",
"banana": "Chuối",
"chilli pepper": "Ớt",
"corn": "Ngô",
"cucumber": "Dưa chuột",
"grapes": "Nho",
"kiwi": "Kiwi",
"lemon": "Chanh",
"mango": "Xoài",
"orange": "Cam",
"pear": "Lê",
"pineapple": "Dứa",
"pomegranate": "Lựu",
"tomato": "Cà chua",
"watermelon": "Dưa hấu"
};

// Chức năng tải ảnh và gọi API
let selectedFile = null;
let loading = false;

// Hàm xử lý khi chọn file ảnh
	window.handleFileChange = function(event) {
	const file = event.target.files[0];
	selectedFile = file;

	const previewContainer = document.getElementById("image-preview");
	const reader = new FileReader();

	reader.onload = function (e) {
	const img = document.createElement("img");
	img.src = e.target.result;
	img.style.width = "400px"; // Cỡ ảnh preview
	img.style.height = "200px"; // Cài đặt chiều cao
	previewContainer.innerHTML = ""; // Xóa ảnh cũ
	previewContainer.appendChild(img);

	// Thay thế ảnh mặc định với ảnh tải lên
	const defaultImage = document.getElementById("default-image");
	defaultImage.src = e.target.result;  // Cập nhật ảnh hiển thị
	};

	reader.readAsDataURL(file);
	document.getElementById("upload-btn").disabled = false; // Bật nút gửi ảnh khi có ảnh
	document.getElementById("prediction").textContent = ""; // Xóa kết quả cũ
	document.getElementById("confidence").textContent = "";
	document.getElementById("error-message").textContent = ""; // Xóa lỗi cũ
	};

	window.uploadImage = async function() {
        if (!selectedFile) {
            alert("Vui lòng chọn ảnh trước!");
            return;
        }
    
        document.getElementById("loading-spinner").style.display = "block";
        document.getElementById("upload-btn").disabled = true;
        document.getElementById("error-message").textContent = "";
        document.getElementById("prediction").textContent = "Đang xử lý...";
        document.getElementById("confidence").textContent = "";
    
        const formData = new FormData();
        formData.append("file", selectedFile);
    
        try {
            const response = await fetch("https://fruit-api-b8fy.onrender.com/predict", {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json",
                },
            });
    
            const data = await response.json();
            if (response.ok) {
                const predictedLabel = data.prediction;
                const confidence = data.confidence;
    
                if (confidence < 0.7) {
                    document.getElementById("prediction").textContent = "Không thể dự đoán vì độ tin cậy thấp.";
                    document.getElementById("confidence").textContent = `Độ chính xác: ${(confidence * 100).toFixed(3)}%`;
                } else {
                    const vietnameseLabel = labelsVietnamese[predictedLabel.toLowerCase()] || predictedLabel;
                    document.getElementById("prediction").textContent = `Kết quả: ${vietnameseLabel}`;
                    document.getElementById("confidence").textContent = `Độ chính xác: ${(confidence * 100).toFixed(3)}%`;
                }
            } else {
                throw new Error(data.message || "Có lỗi xảy ra khi gọi API!");
            }
        } catch (error) {
            document.getElementById("error-message").textContent = `Lỗi: ${error.message}`;
        } finally {
            document.getElementById("loading-spinner").style.display = "none";
            document.getElementById("upload-btn").disabled = false;
        }
    };
    


    // Document on load.
    $(function(){
        fullHeight();
        burgerMenu();
        counterWayPoint();
        contentWayPoint();
        owlCarouselFeatureSlide();
    });

}());

/**
 * WordPress Media Uploader for Hero Slides
 * Handles image upload, preview, and removal
 */

jQuery(document).ready(function ($) {
    'use strict';

    var mediaUploader;

    /**
     * Upload Image Button Click Handler
     */
    $('#hero_slide_image_upload_btn').on('click', function (e) {
        e.preventDefault();

        // If the uploader object has already been created, reopen the dialog
        if (mediaUploader) {
            mediaUploader.open();
            return;
        }

        // Create the media uploader frame
        mediaUploader = wp.media({
            title: 'Choose Hero Slide Background Image',
            button: {
                text: 'Use This Image'
            },
            multiple: false,  // Only allow single image selection
            library: {
                type: 'image'  // Only show images
            }
        });

        // When an image is selected in the media uploader
        mediaUploader.on('select', function () {
            var attachment = mediaUploader.state().get('selection').first().toJSON();

            // Populate the hidden input field with the image URL
            $('#hero_slide_image_url').val(attachment.url);

            // Show the image preview
            $('#hero_slide_image_preview').attr('src', attachment.url).show();

            // Show the remove button
            $('#hero_slide_image_remove_btn').show();

            // Hide the upload button text (optional UX improvement)
            // You can also change button text to "Change Image"
            $('#hero_slide_image_upload_btn').text('Change Image');
        });

        // Open the uploader dialog
        mediaUploader.open();
    });

    /**
     * Remove Image Button Click Handler
     */
    $('#hero_slide_image_remove_btn').on('click', function (e) {
        e.preventDefault();

        // Clear the hidden input field
        $('#hero_slide_image_url').val('');

        // Hide the image preview
        $('#hero_slide_image_preview').hide().attr('src', '');

        // Hide the remove button
        $(this).hide();

        // Reset upload button text
        $('#hero_slide_image_upload_btn').text('Upload Slide Image');
    });
});

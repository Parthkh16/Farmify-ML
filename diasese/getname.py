import os
import glob
from PIL import Image
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Base directory path
BASE_DIR = r"C:\\Users\\parth\\Downloads\\Dataset1"

def convert_to_jpg_rgb(image_path):
    """
    Convert an image to JPG RGB format if it's not already in that format.
    Returns True if conversion was done, False if no conversion was needed.
    """
    try:
        with Image.open(image_path) as img:
            # Check if the image is already a JPG in RGB mode
            if img.format == 'JPEG' and img.mode == 'RGB':
                logger.info(f"No conversion needed for {image_path}")
                return False
            
            # Convert to RGB if it's not already
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Create the new filename with .jpg extension
            filename, ext = os.path.splitext(image_path)
            new_filename = f"{filename}.jpg"
            
            # If the original is already a jpg, but needs RGB conversion
            if image_path == new_filename:
                # Save with RGB conversion overwriting the original
                img.save(new_filename, 'JPEG', quality=95)
                logger.info(f"Converted {image_path} to RGB mode")
            else:
                # Save as new jpg file and remove the original
                img.save(new_filename, 'JPEG', quality=95)
                logger.info(f"Converted {image_path} to {new_filename}")
                os.remove(image_path)
                logger.info(f"Removed original file {image_path}")
            
            return True
    except Exception as e:
        logger.error(f"Error processing {image_path}: {str(e)}")
        return False

def clean_directory(directory):
    """Process all image files in a directory"""
    if not os.path.exists(directory):
        logger.error(f"Directory not found: {directory}")
        print(f"Directory not found: {directory}")
        # Continue execution instead of raising an exception
        return
    
    logger.info(f"Processing directory: {directory}")
    
    # Common image extensions
    image_extensions = ['*.png', '*.jpg', '*.jpeg', '*.bmp', '*.tiff', '*.gif', '*.webp']
    
    # Find all images in the directory
    image_files = []
    for ext in image_extensions:
        image_files.extend(glob.glob(os.path.join(directory, ext)))
        # Also look in subdirectories
        image_files.extend(glob.glob(os.path.join(directory, '**', ext), recursive=True))
    
    if not image_files:
        logger.warning(f"No image files found in {directory}")
        return
    
    logger.info(f"Found {len(image_files)} image files in {directory}")
    
    # Convert files
    converted = 0
    for image_path in image_files:
        if convert_to_jpg_rgb(image_path):
            converted += 1
    
    logger.info(f"Converted {converted} out of {len(image_files)} files in {directory}")

def main():
    # Use the correct directory names
    directories = ["train1", "train2", "train3", "valid1", "valid2", "valid3"]
    
    for dir_name in directories:
        dir_path = os.path.join(BASE_DIR, dir_name)
        clean_directory(dir_path)
    
    logger.info("Conversion process completed")

if __name__ == "__main__":
    main()
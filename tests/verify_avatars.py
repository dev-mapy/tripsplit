from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Desktop check
            page.set_viewport_size({"width": 1280, "height": 720})
            page.goto("http://localhost:3000/home", wait_until="networkidle")
            social_proof = page.locator(".mt-12.flex.flex-col")
            social_proof.scroll_into_view_if_needed()
            social_proof.screenshot(path="/home/jules/verification/final_avatar_check.png")

            # Mobile check
            page.set_viewport_size({"width": 375, "height": 667})
            page.goto("http://localhost:3000/home", wait_until="networkidle")
            social_proof = page.locator(".mt-12.flex.flex-col")
            social_proof.scroll_into_view_if_needed()
            social_proof.screenshot(path="/home/jules/verification/final_avatar_mobile.png")

            print("Screenshots taken successfully.")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    if not os.path.exists("/home/jules/verification"):
        os.makedirs("/home/jules/verification")
    run()

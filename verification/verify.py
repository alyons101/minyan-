from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_app(page: Page):
    # Go to home
    page.goto("http://localhost:5173")

    # Check title
    expect(page.get_by_role("heading", name="Minyan Tracker")).to_be_visible()

    # Check Log Minyan page elements
    expect(page.get_by_role("heading", name="Log Minyan")).to_be_visible()
    expect(page.get_by_role("combobox").first).to_have_value("Shacharit")

    # Take screenshot of Log page
    page.screenshot(path="verification/log_page.png")

    # Log a minyan
    page.get_by_role("button", name="Log Minyan").click()
    expect(page.get_by_text("Minyan logged successfully!")).to_be_visible()

    # Go to Stats
    page.get_by_role("link", name="Stats").click()
    expect(page.get_by_text("Total Minyanim")).to_be_visible()
    page.screenshot(path="verification/stats_page.png")

    # Go to History
    page.get_by_role("link", name="History").click()
    expect(page.get_by_role("heading", name="History")).to_be_visible()
    page.screenshot(path="verification/history_page.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_app(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

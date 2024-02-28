import * as React from "react";
import "./EazyResume.css";
import { Link } from "react-router-dom";
import PageHeading from "./PageHeading";
import "./ExtendableInput.css";

function EazyResume(props) {
  return (
    <div className="eazyresume">
      <PageHeading
        currentPageName="EazyResume" // Set the current page name dynamically
        description="Build a winning resume with EazyResume. Pre-fill your details and let AI do the job.
        "
        imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/c383c376fd6419f882c8c32495460c8a086d69b14a08e188741b191f99a7004f?" // Set the image URL dynamically
        linkTutorial="https://www.loom.com/share/95417cc892e44e8eba841e9188cc7f1b?sid=492a7db3-2300-4b4c-998b-7e65ef4a1cdc" // Example link for the AI page in EazyResume
        tutorialText="Full tutorial here."
      />
      <div>
        <div className="div-29">
          <div className="div-41">
            <div className="div-42">
              <div className="div-43">
                <div className="div-44" />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e650ec2393009b66181c7479056688be2509374c754cd9a44081966ceb8d0c8?"
                  className="img-9"
                />
                <div className="div-45">Download</div>
              </div>
              <div className="div-46" />
              <div className="div-47">
                <div className="div-48" />
                <div className="div-49">
                  <div className="div-50" />
                  <div className="div-51" />
                  <div className="div-52" />
                </div>
                <div className="div-53" />
                <div className="div-54">Work Experience</div>
              </div>
              <div className="div-55">
                <div className="div-56">
                  <div className="div-57" />
                  <div className="div-58" />
                  <div className="div-59">＋</div>
                </div>
                <div className="div-60">
                  <div className="div-61" />
                  <div className="div-62" />
                </div>
                <div className="div-63" />
                <div className="div-64">
                  <div className="div-65">Generate with GPT</div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e3b717f1300eafafbc705b28c03f27fe5e094d925f40de133bb082f246f323a3?"
                    className="img-10"
                  />
                </div>
                <div className="div-66">Education</div>
              </div>
              <div className="div-67">
                <div className="div-68" />
                <div className="div-69" />
                <div className="div-70">＋</div>
              </div>
              <div className="div-71">
                <div className="div-72" />
                <div className="div-73" />
              </div>
              <div className="div-74" />
              <div className="div-75">Leadership Experience & Projects</div>
              <div className="div-76">
                <div className="div-77">−</div>
                <div className="div-78" />
                <div className="div-79" />
                <div className="div-80">＋</div>
              </div>
              <div className="div-81">
                <div className="div-82" />
                <div className="div-83" />
              </div>
              <div className="div-84" />
              <div className="div-85">Skills & Interests</div>
              <div className="div-86" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{``}</style>
    </div>
  );
}
export default EazyResume;

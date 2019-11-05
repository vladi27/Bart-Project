import WindowedSelect from "react-windowed-select";
import React, { Component, PureComponent } from "react";
import { components, createFilter } from "react-windowed-select";
import Select from "react-select";
import { css } from "@emotion/core";
import { throws } from "assert";
const SelectorContainer = React.memo(
  ({ handleSelect, values, customFilter }) => {
    const options = [
      {
        value: "8",
        label: "Millbrae/Daly City - Richmond"
      },
      {
        value: "7",
        label: "Richmond - Daly City/Millbrae"
      },
      {
        value: "6",
        label: "Daly City - Warm Springs/South Fremont"
      },
      {
        value: "5",
        label: "Warm Springs/South Fremont - Daly City"
      },
      {
        value: "4",
        label: "Richmond - Warm Springs/South Fremont"
      },
      {
        value: "3",
        label: "Warm Springs/South Fremont - Richmond"
      },
      {
        value: "2",
        label: "Millbrae/SFIA - Antioch"
      },
      {
        value: "1",
        label: "Antioch - SFIA/Millbrae"
      }
    ];
    function handleChange(value) {
      handleSelect(value);
    }
    console.log(options);

    //   function customFilter() {
    //     createFilter({ ignoreAccents: false });
    //   }

    return (
      <div className="react-select__menu">
        <WindowedSelect
          options={options}
          isMulti
          values={values}
          styles={{ marginBottom: "200px" }}
          placeholder={"hello"}
          className="basic-multi-select"
          classNamePrefix="select"
          //filterOption={customFilter}
          onChange={handleChange}
        />
      </div>
    );
  }
);

export default SelectorContainer;

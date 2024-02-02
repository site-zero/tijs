export default {
  name: "nested",
  text: "i18n:ti-form-example-nested",
  expectWidth: 600,
  comConf: {
    data: {
      id: "Um5Cub2yX",
      nickname: "Mahanta Lloyd",
      title: "pamperedly schmitz enne",
      brief: "Earthy numerably abulia globus rosinweed. ",
      client: "192.168.12.211",
      age: 32,
      role: "staff",
      address: "stuck-uppishness pteromalid"
    },
    defaultComType: "TiInput",
    layout: 1,
    maxFieldNameWidth: 80,
    fields: [
      {
        title: "General",
        layout: "[[3,600],[2,300],1]",
        fields: [
          {
            title: "Id",
            name: "id",
            className: "haha-title",
            style: {
              color: "red",
              gridColumnEnd: "span 2"
            },
            comType: "TiLabel"
          },
          { title: "Age", name: "age", type: "Integer" },
          { title: "Nickname Of User", name: "nickname" },
          { title: "Title", name: "title" },
          {
            title: "Pet",
            layout: 1,
            style: {
              gridRowEnd: "span 3"
            },
            fields: [
              { title: "Name", name: "pet_name" },
              { title: "Age", name: "pet_age", type: "Integer" }
            ]
          },
          { title: "Brief", name: "breif" },
          { title: "Client", name: "client" },
          { title: "Role", name: "role" }
        ]
      },
      {
        title: "More",
        layout: "[[3,600],[2,300],1]",
        fields: [
          { title: "City", name: "city" },
          { title: "Street", name: "street" },
          { title: "Address", name: "address" },
          { title: "Msg Code", name: "msg_code" },
          { title: "Note", name: "note" },
          { title: "Color", name: "color" },
          { title: "Birthday", name: "birthday" },
          { title: "Company", name: "company" }
        ]
      }
    ]
  }
};
